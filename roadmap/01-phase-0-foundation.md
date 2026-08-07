# Phase 0 — Platform Foundation

**Pillar:** none directly — this is the substrate every other phase builds on.

## Goal

Stand up the multi-tenant SaaS platform itself before any privacy feature ships. Every later
phase (especially Prove, in Phase 6) depends on decisions made here — particularly the audit log
and RBAC model — so it's worth getting right early rather than retrofitting later.

## Scope

- **Multi-tenancy model**: Organization → Workspace → Asset (Website / App / System) hierarchy.
  This hierarchy is reused by every module: consent banners attach to Assets, PII scans attach to
  Assets, RoPA entries reference Assets, etc.
- **AuthN/AuthZ**: SSO (SAML/OIDC), RBAC with roles that map to how privacy teams actually work —
  Admin, Privacy Officer, Analyst, Viewer, Auditor (read-only, used again in Phase 6).
- **Billing/subscription skeleton**: plan tiers, usage metering placeholders (even if pricing
  isn't finalized, the metering hooks should exist since Phase 7's API platform needs usage-based
  billing).
- **Immutable audit-logging service**: every user and system action recorded as an event. This is
  the single most-reused piece of infrastructure in the entire roadmap — Consent logs (Phase 1),
  DSAR audit trails (Phase 2), RoPA change tracking (Phase 4), and the entire Prove pillar
  (Phase 6) all read from this.
- **Encryption & secrets**: encryption at rest and in transit, secrets management, per-tenant data
  residency flags (needed for cross-border transfer tracking in Phase 3/4).
- **Notification service skeleton**: email/webhook dispatch, reused by Consent (Phase 1), DSAR
  (Phase 2), and Breach Notification (Phase 6).
- **Internal API gateway** with a versioning convention — this becomes the base of Phase 7's
  public API/Developer Platform, so design it as if it will be public from day one.
- **CI/CD, environments, observability**: logging, metrics, tracing.

## Implementation steps

- [ ] Define core entity model: Organization, Workspace, Asset, User, Role
- [ ] Build SSO (SAML/OIDC) + RBAC with the five baseline roles
- [ ] Build immutable audit-log service (append-only store, queryable by actor/action/entity/time)
- [ ] Build notification service (email + webhook dispatch, retry/backoff)
- [ ] Stand up internal API gateway with versioning (`/v1/...`) and auth (API keys + OAuth)
- [ ] Encryption at rest (per-tenant keys or envelope encryption) and in transit (TLS everywhere)
- [ ] Secrets management (vault-based, no secrets in code/config)
- [ ] Data residency flag per tenant (region pinning — needed for DPDP/GDPR data-localization questions)
- [ ] Billing skeleton: plan/tier model + usage-event emission (even before pricing is final)
- [ ] CI/CD pipelines, staging + prod environments, centralized logging/metrics/tracing

## Dependencies

None — this is the starting point.

## Exit criteria

A tenant can sign up, create an org, invite teammates with distinct roles, and every action they
take is captured in the audit log and queryable.

## Suggested duration

4–6 weeks with a small founding engineering team.
