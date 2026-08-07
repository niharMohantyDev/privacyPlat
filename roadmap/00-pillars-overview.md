# The Six Pillars — Full Module Map

This is the complete inventory of modules under consideration, organized by pillar, with the
build phase each is assigned to. Use this as the master reference — phase files link back here.

## 🟦 Discover — "Where is personal data?"

| Module | Phase |
|---|---|
| Data Discovery & PII Scanning (DBs, cloud storage, file servers, Drive/M365/SharePoint, Salesforce, CRMs, warehouses, email, PDFs, docs, logs, backups, SaaS apps) | 3 |
| PII identification (name, email, phone, address, govt IDs, financial, health, auth info, employee info, location, device IDs, IPs) | 3 |
| Automatic classification (Personal / Sensitive-Regulated / Non-personal) | 3 |
| Data Inventory (what/where/who owns/why/who can access/flows/retention/systems) | 3 |
| Data Flow Mapping (sources, destinations, internal/third-party/cross-border transfers, processors/sub-processors) | 3 |

## 🟩 Consent — "What did the person allow?"

| Module | Phase |
|---|---|
| Cookie & tracker management (scanning, classification, first/third-party ID, ownership, purpose mapping, expiration/unknown-cookie detection, script discovery/inventory, automatic blocking) | 1 |
| Cookie consent banners, preferences center, granular consent by purpose | 1 |
| Consent lifecycle (withdrawal, renewal/expiry, versioning, logs, receipts) | 1 |
| Standards: Google Consent Mode, IAB TCF, Global Privacy Control, geo-specific rules | 1 |
| Consent APIs / SDKs, mobile-app consent | 1 (web), 7 (mobile) |
| Consent orchestration across websites/apps | 7 |
| Consent beyond cookies (marketing/email/SMS/WhatsApp/calls/personalization/analytics/advertising/location/biometrics/AI/data sharing) | 2 |
| Preference Management (centralized preference center) | 2 |

## 🟨 Rights — "What does the person want us to do?"

| Module | Phase |
|---|---|
| Data Principal / Data Subject Requests (access, correction, deletion, portability, consent withdrawal, restriction/opt-out, processing info) | 2 |
| DSAR workflow (submit → verify identity → find data → system requests → collect → review → respond → audit) | 2 |
| Data Deletion & Retention (policies, schedules, expiry detection, deletion workflows, legal holds, backup deletion, verification/certificates) | 4 |

## 🟧 Govern — "Are we processing data correctly?"

| Module | Phase |
|---|---|
| RoPA / Records of Processing Activities | 4 |
| Privacy Notice Management (policies, generator, templates, versioning, change tracking, multi-language, region-specific, publishing, acceptance tracking) | 1 (basic), 4 (full suite) |
| Vendor / Third-Party Privacy Management | 4 |
| DPA Management | 4 |
| Privacy Impact Assessments (DPIA/PIA) | 4 |
| Privacy Risk Management (risk register/dashboard) | 4 |

## 🟥 Protect — "Can we technically prevent misuse?"

| Module | Phase |
|---|---|
| Data Masking / Anonymization (mask, tokenize, hash, encrypt, anonymize, pseudonymize) | 5 |
| AI Privacy / AI Governance (AI system inventory, PII-in-prompt detection, block/redact/warn) | 5 |
| Employee Privacy (HR, monitoring, CCTV, biometrics, attendance, payroll, recruitment) | 5 |
| Children's Data (age verification, parental consent, child-data classification) | 5 |
| Privacy-by-Design workflow (feature → questionnaire → assessment → risk score → DPIA → approval) | 5 |

## 🟪 Prove — "Can we demonstrate compliance?"

| Module | Phase |
|---|---|
| Breach / Incident Management | 6 |
| Data Breach Notification (internal/data subject/regulator/customer/vendor) | 6 |
| Privacy Grievance Management | 6 |
| Privacy Compliance Frameworks (DPDP, GDPR, CCPA/CPRA, ISO 27001/27701, SOC 2, HIPAA, PCI DSS — one control → many regulations) | 6 |
| Compliance Dashboard (executive rollup) | 6 |
| Audit Management (evidence, control testing, auditor access, findings, corrective actions) | 6 |

## Cross-cutting — Platform & Scale

| Module | Phase |
|---|---|
| API / Developer Platform (REST, webhooks, SDKs) | 7 |
| Mobile Privacy (SDK inventory, tracker detection, consent SDK, permissions, disclosures) | 7 |
| Privacy Automation / Workflow Engine ("Zapier for privacy") | 7 |
| Privacy Center / Data Principal Portal | 7 |
