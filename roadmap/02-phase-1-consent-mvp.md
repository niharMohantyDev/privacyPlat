# Phase 1 — Consent MVP (CookieYes-style core)

**Pillar:** 🟩 Consent (plus the web-facing slice of Cookie & Tracker Management and a basic
Privacy Notice generator)

## Goal

Ship the standalone, sellable MVP. This mirrors the proven CookieYes go-to-market motion: a
customer drops in one script tag and gets an auto-scanned cookie/tracker inventory, a compliant
banner + preference center, and exportable consent logs. This is the module that should fund the
rest of the roadmap.

## Scope

**Cookie & tracker discovery**
- Automatic cookie scanning, tracker discovery, script discovery
- Tag/script inventory, third-party technology inventory
- Cookie classification (first-party vs third-party), cookie purpose mapping, cookie ownership
- Cookie expiration detection, unknown-cookie detection
- Cookie audit reports

**Consent UI**
- Cookie consent banners, consent preferences center
- Granular consent by purpose
- Script consent gating / automatic blocking (before consent is given)

**Consent lifecycle**
- Consent withdrawal, renewal/expiry, versioning
- Consent logs, consent receipts (signed, exportable proof)

**Standards compliance**
- Google Consent Mode (v2)
- IAB TCF v2.2 support
- Global Privacy Control (GPC) signal detection
- Geo-specific consent rules (GDPR vs DPDP vs CCPA vs neutral, by IP-based region detection)

**Privacy Notice basics**
- Privacy policy + cookie policy generator, templates
- Version control, multi-language support
- Policy publishing, acceptance tracking

**Developer surface**
- Consent APIs, lightweight embeddable JS SDK

## Implementation steps

- [ ] Build embeddable JS SDK (banner + preference center widget, single script-tag install)
- [ ] Build crawler/scanner service that periodically visits a site and enumerates cookies/scripts/trackers
- [ ] Cookie classification: seed with a known-cookie database + heuristics for unknowns
- [ ] Script blocking: tag-manager-style proxy that gates scripts until consent is given per purpose
- [ ] Consent record store keyed by data subject/device + purpose + timestamp + version — **this
      schema is reused by every later phase**, design it carefully
- [ ] Consent receipt generation (signed, exportable, timestamped proof of what was consented to)
- [ ] Geo-detection (IP-based) driving region-specific banner logic
- [ ] Google Consent Mode v2 integration hooks
- [ ] IAB TCF v2.2 vendor list + signal support
- [ ] GPC signal detection with auto opt-out mapping
- [ ] Policy generator: templated documents with org-variable substitution, multi-language
- [ ] Public Consent API + webhook events (`consent.given`, `consent.withdrawn`, `consent.renewed`)
- [ ] Admin dashboard: banner customization, scan results, consent analytics, audit reports

## Dependencies

Phase 0 (tenancy, auth, audit log, notification service).

## Exit criteria

A customer can install one script tag, get an auto-scanned cookie/tracker inventory, publish a
compliant banner + preference center, and export consent logs/receipts — sellable standalone as a
CookieYes competitor.

## Suggested duration

8–12 weeks. This is the largest single-phase investment before first revenue, since the scanner,
SDK, and standards integrations (TCF/Consent Mode/GPC) are each nontrivial.

## Risks / considerations

- Cookie/tracker classification accuracy directly affects trust — budget time for a maintained
  known-cookie/tracker database, not just heuristics.
- The consent-record schema designed here becomes load-bearing for DSAR (Phase 2), RoPA (Phase 4),
  and Compliance Dashboard (Phase 6) — avoid a web-only shape; model purpose/channel generically
  so Phase 2 can extend it to non-cookie consent without a rewrite.
