# Phase 3 — Discover: PII Scanning, Data Inventory & Flow Mapping

**Pillar:** 🟦 Discover

## Goal

This is the phase that turns the product from "a cookie consent tool" into an actual privacy
platform. It's also the hardest engineering lift in the roadmap — but once built, it makes almost
everything downstream automatic instead of manual: RoPA can auto-draft (Phase 4), DSARs can
auto-locate records instead of routing manual tasks (Phase 2 upgrade), and retention/deletion can
auto-detect expiry (Phase 4).

## Scope

**Data Discovery & PII Scanning** across:
- Databases, cloud storage, file servers
- Google Drive, Microsoft 365, SharePoint
- Salesforce, CRMs, data warehouses
- Emails, PDFs, documents, logs, backups
- SaaS applications

**PII identification**: name, email, phone, address, government IDs, financial information,
health information, authentication information, employee information, location, device
identifiers, IP addresses

**Automatic classification**: Personal Data / Sensitive-Regulated / Non-personal
(e.g., `email → Personal Data`, `Aadhaar → Sensitive/regulated`, `order_id → Non-personal`)

**Data Inventory**: org-wide map of what personal data exists, where, who owns it, why it's
collected, who can access it, where it flows, retention period, which systems process it

**Data Flow Mapping**: source → destination graph (Customer → Website → CRM → Payment Gateway →
Analytics → Data Warehouse → Marketing), internal transfers, third-party transfers, cross-border
transfers, APIs, processors, sub-processors

## Implementation steps

- [ ] Build a pluggable connector framework (interface: connect, enumerate, sample, classify) —
      start with the 3–5 highest-value connectors: Postgres/MySQL, S3/GCS/Blob storage, Google
      Workspace, Microsoft 365, Salesforce
- [ ] PII detection engine v1: regex/pattern matchers for structured identifiers (email, phone,
      country-specific govt ID formats — Aadhaar/PAN, SSN, etc. — card numbers)
- [ ] PII detection engine v2: NER/ML classifier for unstructured text (documents, PDFs, emails,
      logs)
- [ ] Confidence scoring + human-in-the-loop review queue for low-confidence matches
- [ ] Sensitivity classification rules engine, jurisdiction-aware (e.g., Aadhaar/PAN as sensitive
      under DPDP, SSN under CCPA)
- [ ] Data inventory schema: Asset → Table/Field or File → Data Category → Owner → Purpose →
      Retention → Access list
- [ ] Scheduled re-scan jobs + drift detection (alert on newly discovered/unknown PII stores)
- [ ] Data flow graph builder: infer flows from connector metadata plus manual/API-declared
      integrations
- [ ] Visualization UI: flow diagram, inventory explorer, "where does X live" search
- [ ] Wire Phase 2's DSAR workflow to auto-query the discovered inventory instead of routing
      manual system-owner tasks

## Dependencies

- Phase 0 (connector credentials need secrets management and encryption)
- Phase 1/2 (purpose taxonomy and data-subject model that classification results attach to)

## Exit criteria

Connect a handful of core systems and get an auto-generated, continuously refreshed data
inventory and flow map; DSARs can auto-locate records in connected systems.

## Suggested duration

10–14 weeks. This is the largest engineering investment in the roadmap — budget for connector
maintenance as an ongoing cost, not a one-time build, since SaaS APIs change.

## Risks / considerations

- Connector breadth is a never-ending tail — prioritize by customer demand rather than trying to
  cover every system in the user's original list at once.
- False positives/negatives in PII detection directly undermine trust in the "Prove" pillar later
  — invest in the review queue and confidence scoring rather than shipping a black box.
