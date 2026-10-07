import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '40px 16px', textAlign: 'center', background: 'var(--theme-base, #0b1207)', color: '#f2f7e8', position: 'relative', zIndex: 2 }}>
      <div style={{ fontSize: 64, fontWeight: 900, color: '#c6f432', lineHeight: 1 }}>404</div>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Page not found</h1>
      <p style={{ fontSize: 14, color: 'rgba(226,236,205,0.78)', margin: 0, maxWidth: 320 }}>This page has moved or does not exist.</p>
      <Link href="/" className="btn btn-primary">Plan a route</Link>
    </main>
  )
}
