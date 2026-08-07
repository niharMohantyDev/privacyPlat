# Privacy Platform — Product Roadmap

## Vision

Build a comprehensive privacy compliance platform — a "Zycato/OneTrust-class" product — organized
around six product pillars:

| Pillar | Question it answers |
|---|---|
| 🟦 Discover | Where is personal data? |
| 🟩 Consent | What did the person allow? |
| 🟨 Rights | What does the person want us to do? |
| 🟧 Govern | Are we processing data correctly? |
| 🟥 Protect | Can we technically prevent misuse? |
| 🟪 Prove | Can we demonstrate compliance? |

See [00-pillars-overview.md](00-pillars-overview.md) for the full module map.

## How this roadmap is organized

Each phase file below is a shippable increment: a goal, the modules/features in scope, an
implementation checklist, dependencies on earlier phases, and exit criteria. Phases are numbered
in build order, not pillar order — see "Sequencing philosophy" below for why.

| # | File | Pillar(s) | Focus |
|---|---|---|---|
| 0 | [01-phase-0-foundation.md](01-phase-0-foundation.md) | — (platform substrate) | Multi-tenancy, auth, billing, audit log |
| 1 | [02-phase-1-consent-mvp.md](02-phase-1-consent-mvp.md) | Consent | Cookie/tracker scanning, consent banners, policy generator — the CookieYes-style MVP |
| 2 | [03-phase-2-rights-dsar.md](03-phase-2-rights-dsar.md) | Rights | DSAR platform, preference management |
| 3 | [04-phase-3-discover.md](04-phase-3-discover.md) | Discover | PII scanning, data inventory, data flow mapping |
| 4 | [05-phase-4-govern.md](05-phase-4-govern.md) | Govern | RoPA, retention/deletion, vendor/DPA, DPIA, risk |
| 5 | [06-phase-5-protect.md](06-phase-5-protect.md) | Protect | Masking/anonymization, AI privacy, employee & children's data |
| 6 | [07-phase-6-prove.md](07-phase-6-prove.md) | Prove | Breach/grievance, compliance framework mapping, dashboards, audit |
| 7 | [08-phase-7-platform-scale.md](08-phase-7-platform-scale.md) | Cross-cutting | Public API/SDKs, mobile, orchestration, automation engine, Privacy Center portal |
| — | [09-architecture-notes.md](09-architecture-notes.md) | — | Shared technical architecture referenced by every phase |
| — | [10-milestones-timeline.md](10-milestones-timeline.md) | — | Timeline summary, milestones, success metrics |

## Sequencing philosophy

The user's own module map calls Consent Management "the core CookieYes-style module" — that's
also the fastest path to a sellable product and revenue, so it ships first as an MVP (Phase 1),
even though it sits in the middle of the Discover→Consent→Rights pillar list.

After that, the build order follows a **data-dependency chain**, not the pillar list order:

1. **Foundation (0)** — nothing else works without tenancy, auth, and an audit log.
2. **Consent (1)** — standalone, sellable, funds the rest.
3. **Rights (2)** — DSAR can launch on manual/semi-manual system lookups before automated discovery exists.
4. **Discover (3)** — the hardest engineering lift, but once built it makes almost everything downstream *automatic* instead of manual:
   - RoPA (Govern) can auto-draft from the inventory.
   - DSARs (Rights) can auto-locate records instead of routing manual tasks.
   - Retention/deletion (Govern) can auto-detect expiry.
5. **Govern (4)** and **Protect (5)** mostly *consume* the Discover data model rather than building new infrastructure, so they can partially run in parallel once Phase 3 stabilizes.
6. **Prove (6)** is largely a read-layer over everything already built — cheap once the data model is solid, hollow (or fabricated) if built first. It's sequenced last on purpose.
7. **Platform & Scale (7)** takes everything built and makes it programmable (public API/SDKs), mobile-reachable, and self-serve for the end customer.

## Assumptions

- **Regulatory target**: India's DPDP Act as primary, with GDPR and CCPA/CPRA supported from day
  one — the consent and cookie modules are inherently multi-jurisdiction, so building
  jurisdiction-awareness in from Phase 1 avoids a costly retrofit.
- **Team size / start date**: unspecified. Durations in [10-milestones-timeline.md](10-milestones-timeline.md)
  are relative (weeks of focused work), not calendar dates — scale up or down with actual headcount.
- **"Phase" = shippable increment**, not a rigid chronological block. Phases 4–6 can overlap once
  a small team grows past ~6–8 engineers and the Phase 3 data model is stable.
- This is a living document — update phase files as scope is refined or reprioritized; don't treat
  the phase numbers as a fixed contract.
