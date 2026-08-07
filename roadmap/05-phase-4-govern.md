# Phase 4 — Govern: RoPA, Retention, Vendor/DPA, DPIA, Risk

**Pillar:** 🟧 Govern

## Goal

Move from "we have data about our data" (Phase 3) to "we can prove we're processing it
correctly." Most of this phase *consumes* the Phase 3 data model rather than building new
infrastructure, so RoPA/Retention/DPIA can be largely automated instead of hand-built forms.

## Scope

**RoPA / Records of Processing Activities**
- Processing activity, purpose, data categories, data-subject categories, retention period,
  legal basis, recipients, processors, countries, security measures
- Auto-generated from Data Inventory (Phase 3) + Vendor DB + Consent purposes (Phase 1)

**Privacy Notice Management (full suite)**
- All notice types: privacy policy, cookie policy, collection notices, mobile privacy notices,
  employee privacy notices, vendor privacy notices, children's privacy notices, AI privacy
  notices
- Change tracking, region-specific policies (extends Phase 1's basic generator)

**Data Deletion & Retention**
- Retention policies and schedules, expiry detection
- Deletion workflows, automated deletion, legal holds, backup deletion workflows
- Deletion verification, deletion certificates

**Vendor / Third-Party Privacy Management**
- Vendor/processor/sub-processor database, data shared, processing purposes, countries
- Contracts, DPAs, security certifications, privacy assessments, change monitoring

**DPA Management**
- Data Processing Agreement templates, status, expiration, subprocessor lists
- Contract approval, legal review, version history

**Privacy Impact Assessments (DPIA/PIA)**
- Questionnaire workflow (new project → what data → why → risk → who has access → where stored
  → third parties → risk assessment → mitigation → approval)

**Privacy Risk Management**
- Risk register/dashboard (Critical/High/Medium/Low), owners, remediation, deadlines
- Risk acceptance, residual risk tracking

## Implementation steps

- [ ] RoPA auto-draft generator pulling from Data Inventory (Phase 3) + Vendor DB + Consent
      purposes (Phase 1), with a manual override/approval layer for accuracy
- [ ] Retention policy engine: rule per data category → expiry detection job → deletion/
      anonymization workflow → legal-hold override → deletion certificate (signed record)
- [ ] Vendor registry + risk questionnaire workflow + contract/DPA document store with expiry
      reminders
- [ ] DPIA workflow builder: templated questionnaires with conditional branching by risk answers,
      approval chain
- [ ] Risk register with a severity scoring model, owner assignment, SLA tracking, dashboard
      rollup
- [ ] Extend Phase 1's Policy Generator to the full notice suite (employee/vendor/children/AI
      notices) with change-tracking and version diffing

## Dependencies

Phase 3's Data Inventory and Flow Mapping — without it, RoPA/DPIA/Retention are manual forms
rather than largely-automatic outputs. This is why Govern is sequenced after Discover.

## Exit criteria

RoPA is auto-maintained, not hand-built. Retention/deletion runs on schedule with certificates.
Every vendor has a DPA and a risk profile. Every new project can run a DPIA before launch.

## Suggested duration

10–14 weeks. Can partially parallelize with Phase 5 (Protect) once the Phase 3 data model is
stable and a team has grown past ~6–8 engineers.
