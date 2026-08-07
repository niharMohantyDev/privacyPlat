# Phase 5 — Protect: Masking, AI Privacy, Employee & Children's Data

**Pillar:** 🟥 Protect

## Goal

Apply technical, preventive controls to the data already discovered (Phase 3) and governed
(Phase 4). This phase is mostly "apply protective controls to what's already known about," which
is why it's sequenced after Discover and Govern rather than before.

## Scope

**Data Masking / Anonymization**
- Mask, tokenize, hash, encrypt, anonymize, pseudonymize
- Example: `Rahul Sharma / rahul@gmail.com / +91 9876543210` → `R**** S***** / r****@gmail.com / +91 ******3210`

**AI Privacy / AI Governance**
- AI systems inventory: models, training data, personal data used for training, prompts
- AI vendors, model providers, data retention, AI-related privacy risks
- Real-time PII-in-prompt detection with a block/redact/warn policy
  (e.g., detect "My Aadhaar number is..." → flag → block/redact/warn)

**Employee Privacy**
- HR records, employee monitoring, CCTV, biometrics, attendance, payroll, recruitment,
  background checks

**Children's Data**
- Age verification, parental consent, child-data classification
- Child-specific policies, consent workflows, restrictions

**Privacy-by-Design**
- New feature → privacy questionnaire → data assessment → risk score → DPIA → approval
- Ties directly into Phase 4's DPIA engine as its trigger

## Implementation steps

- [ ] Masking/anonymization library (mask, tokenize, hash, format-preserving encryption,
      pseudonymize) usable both against discovered data stores and via API
- [ ] Apply masking as a remediation action on Data Inventory items (Phase 3) and DSAR exports
      (Phase 2)
- [ ] AI system registry (models, providers, purpose, data used)
- [ ] Real-time PII-in-prompt detector, reusing the PII engine from Phase 3, pluggable into LLM
      API calls or chat UIs, with configurable block/redact/warn policy
- [ ] Employee-data module: reuse Data Inventory/Classification (Phase 3) with an "Employee"
      data-subject type and specific disclosures (CCTV/biometrics/monitoring)
- [ ] Children's data flag on data categories, plus a parental-consent workflow that reuses the
      Phase 1 consent engine with an "age-gated" purpose type
- [ ] Privacy-by-Design intake form wired to the Phase 4 DPIA engine as its output

## Dependencies

Heavy reuse of Phase 3 (PII detection engine) and Phase 4 (DPIA engine, data inventory).

## Exit criteria

PII can be automatically masked wherever exported or displayed. AI usage of PII is visible and
can be blocked in real time. Employee and children's data get first-class handling rather than
being folded into generic customer data.

## Suggested duration

8–10 weeks. Can partially parallelize with Phase 4 once the Phase 3 PII engine is stable.
