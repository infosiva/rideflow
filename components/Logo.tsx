// RideFlow logo: glyph + wordmark, key word in the hub-switchable accent.
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 800, letterSpacing: '-0.02em' }}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="color-mix(in oklab, var(--accent, #c6f432) 18%, #0b1207)" />
        <g fill="none" stroke="var(--accent, #c6f432)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 24c0-6 5-5 8-9s-1-6 3-7 7 1 7 5"/></g>
      </svg>
      <span>Ride</span><span style={{ color: 'var(--accent, #c6f432)' }}>Flow</span>
    </span>
  )
}
export default Logo
