import Link from 'next/link'
import Planner from '@/components/Planner'
import PromoBox from '@/components/PromoBox'
import { Logo } from '@/components/Logo'

const STEPS = [
  ['Paste', 'Drop in 3 to 12 addresses, first line is where you start.'],
  ['Optimize', 'Stops are reordered nearest-first so you stop backtracking.'],
  ['Drive', 'Follow the numbered order and see how many km you saved.'],
]

export default function Home() {
  return (
    <>
      <nav className="nav" aria-label="Main">
        <div className="wrap nav-in">
          <Logo />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <a className="link hide-sm" href="#how">How it works</a>
            <a className="link" href="#pricing">Pricing</a>
            <a className="btn btn-primary" style={{ minHeight: 44, padding: '0 16px', fontSize: 14 }} href="#planner">Plan a route</a>
          </div>
        </div>
      </nav>

      <main className="wrap">
        <header style={{ padding: '22px 0 0' }} className="fade-up hero">
          <h1 style={{ fontSize: 'clamp(26px,4.2vw,40px)', letterSpacing: '-0.04em', lineHeight: 1.08, margin: 0, fontWeight: 800 }}>
            Fewer km between <span style={{ color: 'var(--accent)' }}>every stop.</span>
          </h1>
          <p className="hero-sub" style={{ color: 'var(--text-2)', margin: '8px 0 0', maxWidth: 540, lineHeight: 1.6 }}>
            Route planner for independent drivers and couriers. Paste your stops, get the order.
          </p>
        </header>

        <section id="planner" aria-label="Route planner"><Planner /></section>

        <section id="how" className="sec strip" aria-label="How it works">
          <ol className="steps">
            {STEPS.map(([t, d], i) => (
              <li key={t} title={d}><b>0{i + 1}</b> <strong>{t}</strong> <span>{d}</span></li>
            ))}
          </ol>
        </section>

        <section id="pricing" className="sec strip" aria-label="Pricing">
          <div className="prow">
            <div className="pcell"><strong>Free</strong> <span className="amt">$0</span> <span>12 stops, nearest-first, distance saved, AI assistant</span></div>
            <div className="pcell pro"><strong>Pro</strong> <span>Coming soon: more stops, saved routes, time windows.</span> <PromoBox /></div>
          </div>
        </section>

        <footer className="foot">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <span>&copy; 2026 RideFlow</span>
            <span><Link href="/privacy">Privacy</Link></span>
          </div>
        </footer>
      </main>
    </>
  )
}
