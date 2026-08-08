/**
 * Rough client-side region heuristic from the browser's locale (e.g.
 * "de-DE" -> "DE"). This is NOT real IP-based geo-detection — the
 * roadmap calls for that as a backend concern (Phase 1 full scope);
 * this is a placeholder good enough to exercise the region-aware
 * consent rules (GDPR/DPDP/CCPA) end to end for this milestone.
 */
export function detectRegion(): string {
  const locale = navigator.language || 'en-US'
  const parts = locale.split('-')
  return parts.length > 1 ? parts[1].toUpperCase() : 'DEFAULT'
}
