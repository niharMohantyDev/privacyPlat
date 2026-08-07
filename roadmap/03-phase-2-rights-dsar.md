# Phase 2 — Rights: DSAR Platform & Preference Management

**Pillar:** 🟨 Rights (plus Consent-beyond-cookies as a natural extension of Phase 1's purpose
taxonomy)

## Goal

Give data subjects a way to exercise their rights, and give the org a workflow to fulfill
requests within statutory deadlines — without yet requiring the automated data discovery that
Phase 3 will add. Requests can route to manual/semi-manual system-owner tasks for now.

## Scope

**Data Principal / Data Subject Requests**
- Access, correction, deletion, portability, consent withdrawal, restriction/opt-out, information
  about processing

**DSAR workflow**
- Submission → identity verification → find personal data → send request to systems → collect
  results → review → respond → audit trail

**Preference Management**
- Centralized preference center across Marketing (Email/SMS/WhatsApp/Calls), Personalization,
  Analytics, Advertising, Location, Biometrics, AI processing, Data sharing

**Consent beyond cookies**
- Extend Phase 1's purpose/consent model to non-web channels so preference changes are consistent
  everywhere

## Implementation steps

- [ ] Public-facing data-subject request intake portal (form + auth)
- [ ] Identity verification flow (email OTP as the baseline; pluggable stronger verification later
      for high-sensitivity requests)
- [ ] Request-type routing engine (Access / Correction / Deletion / Portability / Restriction)
- [ ] Manual "system connector" stage: request routed as a task to system owners until Phase 3
      automates discovery — don't block launch on Phase 3
- [ ] SLA/deadline tracking per jurisdiction (e.g., DPDP and GDPR statutory response windows)
- [ ] Review & approval workflow before a response is sent to the data subject
- [ ] Response package generation (JSON/CSV/PDF export formats)
- [ ] Full audit trail per request (reuses Phase 0's audit log)
- [ ] Preference center UI + API (per-channel, per-purpose toggles)
- [ ] Sync preference changes back into the Phase 1 consent store — single source of truth, not a
      parallel system

## Dependencies

- Phase 0 audit log and notification service
- Phase 1 consent/purpose taxonomy and data-subject identity model

## Exit criteria

A data subject can submit a verifiable DSAR, staff can track and respond within the statutory SLA,
and preference changes made anywhere propagate to all channels.

## Suggested duration

6–8 weeks. The workflow engine built here (case creation → assignment → SLA tracking → resolution
→ audit trail) is deliberately generic — Phase 6 reuses the same engine for Breach and Grievance
cases instead of building three separate systems.
