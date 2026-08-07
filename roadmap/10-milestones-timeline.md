# Milestones & Timeline Summary

Durations are relative (weeks of focused engineering work), not calendar dates — team size and
start date weren't specified. Scale up or down with actual headcount. See
[README.md](README.md#assumptions) for the assumptions behind these estimates.

## Summary table

| Phase | Pillar | Core modules | Est. duration | Milestone |
|---|---|---|---|---|
| 0 | Foundation | Multi-tenancy, auth, billing, audit log | 4–6 weeks | Internal: platform substrate ready |
| 1 | Consent | Cookie/tracker scanning, consent banners, policy generator | 8–12 weeks | **M1**: First paying customer (CookieYes-style standalone sale) |
| 2 | Rights | DSAR platform, preference center | 6–8 weeks | **M2**: DSAR live, statutory SLA tracked |
| 3 | Discover | PII scanning/connectors, data inventory, flow mapping | 10–14 weeks | **M3**: True "privacy platform" positioning unlocked |
| 4 | Govern | RoPA, retention/deletion, vendor/DPA, DPIA, risk | 10–14 weeks | **M4**: Enterprise-compliance-ready |
| 5 | Protect | Masking, AI privacy, employee/children's data | 8–10 weeks | **M5**: Regulated-industry-ready |
| 6 | Prove | Breach/grievance, compliance frameworks, dashboard, audit | 8–10 weeks | **M6**: Auditor/executive-ready |
| 7 | Platform & Scale | Public API/SDKs, mobile, orchestration, automation engine, Privacy Center | Ongoing | **M7**: Ecosystem + self-serve customer experience |

**Cumulative time to M4 (enterprise-compliance-ready)**: roughly 46–64 weeks of focused work,
before accounting for phase overlap.

Phases 4–6 can partially parallelize once a team scales past ~6–8 engineers and the Phase 3 data
model is stable, since Govern, Protect, and Prove mostly *consume* the Discover data model rather
than building new infrastructure. That overlap can meaningfully compress the 4–6–14 week stretch.

## Milestone details & success metrics

**M1 — First paying customer** (end of Phase 1)
- Product is sellable standalone as a cookie-consent/CookieYes competitor
- Success metric: N logos on the Consent module alone, before any other pillar exists

**M2 — DSAR live** (end of Phase 2)
- Data subjects can submit and receive fulfillment of rights requests within statutory SLA
- Success metric: 100% of DSARs resolved within jurisdictional deadline

**M3 — True privacy platform** (end of Phase 3)
- Product can answer "where is our personal data?" without manual spreadsheets
- Success metric: N connectors live, X% of a customer's known systems covered by automated
  discovery

**M4 — Enterprise-compliance-ready** (end of Phase 4)
- RoPA, retention, vendor/DPA, and DPIA are running on real data, not templates
- Success metric: RoPA auto-refreshes without manual re-entry; 100% of active vendors have a DPA
  on file

**M5 — Regulated-industry-ready** (end of Phase 5)
- Masking, AI-prompt PII detection, and employee/children's-data handling are live
- Success metric: PII exposure in AI tool usage is visible and blockable in real time

**M6 — Auditor/executive-ready** (end of Phase 6)
- A single dashboard reflects live compliance posture across frameworks
- Success metric: an external auditor can be given read-only access and self-serve the evidence
  they need, without a manual evidence-gathering exercise

**M7 — Ecosystem** (Phase 7, ongoing)
- Third parties integrate via API/SDK; mobile parity with web; recurring operations automated
- Success metric: % of DSAR/deletion requests fulfilled with zero manual intervention via the
  automation engine
