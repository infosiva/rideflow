export function Logo({ size = 28 }: { size?: number }) {
  return (
    <a href="/" className="brand" aria-label="RideFlow home">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
        <rect width="64" height="64" rx="14" fill="#c6f432" />
        <path d="M14 48c0-12 10-10 14-18s-2-12 6-14 14 2 14 10" fill="none" stroke="#0b1207" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="48" r="5" fill="#0b1207" />
        <path d="M48 14l-8 10h16z" fill="#0b1207" />
      </svg>
      <span>Ride<b>Flow</b></span>
    </a>
  )
}
