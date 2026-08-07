# Cross-Cutting Architecture Notes

These notes apply across every phase and are referenced from each phase file rather than repeated.
Get these decisions right early — several of them are expensive to retrofit.

## Core data model entities

A small set of entities is reused across nearly every module. Model these generically from the
start so later phases extend rather than duplicate them:

- **Organization / Workspace / Asset** (Phase 0) — the tenancy hierarchy everything else attaches to
- **User / Role** (Phase 0)
- **DataSubject** — a person the platform holds data about; may be a customer, employee, or child;
  identity can be anonymous/pseudonymous (cookie/device-keyed) or verified (email/OTP-keyed)
- **PurposeTaxonomy** — the list of processing purposes (marketing, analytics, AI processing,
  etc.), defined once in Phase 1 and reused by Consent, Rights, and RoPA
- **ConsentRecord** — subject + purpose + channel + timestamp + version + status; the schema from
  Phase 1 should be channel-agnostic (web cookie, mobile, email, WhatsApp) from day one so Phase 2
  doesn't require a rewrite
- **DataStore / PIIAsset** — a discovered system, table, field, or file, with its classification
  (Phase 3)
- **ProcessingActivity** — a RoPA entry (Phase 4), largely derived from DataStore + Vendor +
  PurposeTaxonomy
- **Vendor / DPA** — third-party processor records (Phase 4)
- **Request / Case** — a single generic workflow engine (submit → assign → SLA → resolve → audit)
  reused for DSAR (Phase 2), Breach (Phase 6), and Grievance (Phase 6) instead of building three
  separate systems
- **Risk** — register entries with severity/owner/remediation (Phase 4)
- **Policy / Notice** — versioned documents (Phase 1 basic, Phase 4 full suite)
- **Control / Framework mapping** — compliance controls, many-to-many to framework clauses
  (Phase 6)

## Why "Request/Case" is one engine, not three

DSAR, Breach, and Grievance all share the same shape: intake → identity/severity triage →
investigation/fulfillment → review → response → audit trail, with jurisdiction-specific SLA
clocks. Building one configurable case engine in Phase 2 and reusing it in Phase 6 avoids
duplicating the workflow, SLA-tracking, and audit-trail logic three times.

## Connector / scanning plugin architecture (Phase 3)

Define a single interface every connector implements:

```
connect(credentials) -> connection
enumerate(connection) -> [resource]
sample(resource) -> [record]
classify(record) -> [PII match + confidence]
```

This lets Phase 3 ship a handful of connectors first (Postgres/MySQL, cloud storage, Google
Workspace, Microsoft 365, Salesforce) and expand the list over time without changing the core
scanning/classification pipeline.

## PII detection engine layering (Phase 3, reused in Phase 5)

1. **Regex/pattern layer** — structured identifiers: email, phone, jurisdiction-specific
   government ID formats (Aadhaar/PAN, SSN, NIN, etc.), card numbers
2. **ML/NER layer** — unstructured text: documents, PDFs, emails, logs
3. **Human review layer** — low-confidence matches route to a review queue rather than being
   silently accepted or rejected

Confidence thresholds should be tunable per data category and jurisdiction, since sensitivity
classification is itself jurisdiction-dependent (e.g., Aadhaar is sensitive under DPDP; SSN is the
analog under US frameworks).

## Consent SDK architecture (Phase 1, extended in Phase 7)

- Script loader served from a CDN, single script-tag install
- Tag-manager-style proxy that gates third-party scripts until consent is granted per purpose
- Local storage of the consent string, synced to the backend ConsentRecord store
- Adapter layer for Google Consent Mode v2, IAB TCF v2.2, and GPC — each is a translation from the
  internal ConsentRecord model to that standard's wire format, not a parallel consent store
- Phase 7's mobile SDK should mirror this architecture rather than being a separate design

## Compliance control graph (Phase 6)

Model controls as first-class objects with many-to-many relationships to framework clauses
(DPDP §X, GDPR Art. Y, ISO 27701 §Z can all point at the same "data retention policy documented
and enforced" control). Where possible, derive control status from live platform signals (e.g.,
"encryption at rest" reads Phase 0's config; "RoPA maintained" reads Phase 4's last-updated
timestamp) rather than requiring manual attestation for everything.

## Security posture (from Phase 0 onward)

This product processes sensitive personal data as its core function, so it needs to be its own
best customer: encryption at rest and in transit, strong key management, RBAC enforced
consistently across every module, an immutable audit log, and per-tenant data-residency flags.
Retrofitting any of these after Phase 3's connectors start pulling customer PII into the platform
is significantly more expensive than building them in from Phase 0.
