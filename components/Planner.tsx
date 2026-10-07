'use client'
import { useEffect, useState } from 'react'

// Sample runs: real landmarks, first line is the start. Rotated in the demo; click to load.
const SAMPLES = [
  { label: 'London courier run', stops: ["King's Cross Station, London", 'Tower of London', 'Buckingham Palace, London', 'Camden Market, London', 'Royal Observatory Greenwich, London'] },
  { label: 'New York food drop-offs', stops: ['Grand Central Terminal, New York', 'Empire State Building, New York', 'Central Park Zoo, New York', 'Brooklyn Bridge, New York', 'Battery Park, New York'] },
  { label: 'Chennai parcel round', stops: ['Chennai Central Railway Station', 'Marina Beach, Chennai', 'Kapaleeshwarar Temple, Mylapore, Chennai', 'Phoenix Marketcity, Velachery, Chennai', 'Guindy National Park, Chennai'] },
  { label: 'Sydney airport transfers', stops: ['Sydney Airport', 'Sydney Opera House', 'Queen Victoria Building, Sydney', 'Taronga Zoo, Sydney', 'Bondi Beach, Sydney'] },
  { label: 'Berlin delivery loop', stops: ['Berlin Hauptbahnhof', 'Brandenburg Gate, Berlin', 'Alexanderplatz, Berlin', 'Charlottenburg Palace, Berlin', 'Tempelhofer Feld, Berlin'] },
]

type Pt = { q: string; lat: number; lon: number }
const MAX = 12
const R = 6371
const km = (a: Pt, b: Pt) => {
  const r = (x: number) => (x * Math.PI) / 180
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lon - a.lon) / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
const len = (p: Pt[]) => p.slice(1).reduce((s, x, i) => s + km(p[i], x), 0)
// nearest-neighbour from the first stop. ponytail: greedy, not optimal; 2-opt if routes get long.
function nn(p: Pt[]) {
  const left = p.slice(1), out = [p[0]]
  while (left.length) {
    const last = out[out.length - 1]
    let bi = 0
    left.forEach((x, i) => { if (km(last, x) < km(last, left[bi])) bi = i })
    out.push(left.splice(bi, 1)[0])
  }
  return out
}
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function geocode(q: string): Promise<Pt | null> {
  const r = await fetch(`/api/data?source=geocode&q=${encodeURIComponent(q)}`)
  if (!r.ok) return null
  const j = await r.json()
  const f = Array.isArray(j.data) ? j.data[0] : null
  return f ? { q, lat: parseFloat(f.lat), lon: parseFloat(f.lon) } : null
}

function RouteMap({ pts, demo }: { pts: { x: number; y: number }[]; demo?: boolean }) {
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  return (
    <svg viewBox="0 0 400 250" role="img" aria-label={demo ? 'Example route animation' : 'Optimized route map'}>
      <defs><pattern id="g" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="rgba(198,244,50,0.07)" /></pattern></defs>
      <rect width="400" height="250" fill="url(#g)" />
      <path d={d} fill="none" stroke="#c6f432" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={demo ? 'demo-line' : 'route-line'} key={d} />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="11" fill="#c6f432" />
          <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#0b1207">{i + 1}</text>
        </g>
      ))}
    </svg>
  )
}

const DEMO = [{ x: 50, y: 190 }, { x: 120, y: 90 }, { x: 210, y: 150 }, { x: 290, y: 60 }, { x: 350, y: 120 }]

export default function Planner() {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [si, setSi] = useState(0)
  const [still, setStill] = useState(false)
  const [res, setRes] = useState<{ route: Pt[]; before: number; after: number; skipped: string[] } | null>(null)

  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setStill(rm)
    if (rm) return
    const t = setInterval(() => setSi(i => (i + 1) % SAMPLES.length), 3500)
    return () => clearInterval(t)
  }, [])

  async function run() {
    const lines = text.split('\n').map(s => s.trim()).filter(Boolean)
    setErr('')
    if (lines.length < 3) return setErr('Add at least 3 stops, one per line.')
    if (lines.length > MAX) return setErr(`Free plan covers up to ${MAX} stops.`)
    setBusy(true); setRes(null)
    try {
      const pts: Pt[] = [], skipped: string[] = []
      for (const q of lines) {
        const p = await geocode(q).catch(() => null)
        p ? pts.push(p) : skipped.push(q)
        await sleep(1100) // Nominatim policy: max 1 request/second
      }
      if (pts.length < 3) throw new Error('Could not find enough of those addresses. Add the city or postcode and try again.')
      const route = nn(pts)
      setRes({ route, before: len(pts), after: len(route), skipped })
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Something went wrong. Try again.')
    } finally { setBusy(false) }
  }

  const proj = (r: Pt[]) => {
    const la = r.map(p => p.lat), lo = r.map(p => p.lon)
    const [a, b, c, d] = [Math.min(...la), Math.max(...la), Math.min(...lo), Math.max(...lo)]
    const k = Math.cos(((a + b) / 2) * Math.PI / 180)
    const w = Math.max((d - c) * k, 1e-6), h = Math.max(b - a, 1e-6)
    const s = Math.min(340 / w, 190 / h)
    return r.map(p => ({ x: 200 + ((p.lon - (c + d) / 2) * k) * s, y: 125 - (p.lat - (a + b) / 2) * s }))
  }
  const saved = res ? Math.max(0, res.before - res.after) : 0

  return (
    <div className="bench">
      <div className="panel fade-up">
        <h2>1. Paste your stops</h2>
        <div className="samples" aria-label="Sample runs">
          <span className="samples-k">Try:</span>
          <button type="button" key={still ? 'x' : si} className={`chip ${still ? '' : 'chip-in'}`} onClick={() => setText(SAMPLES[si].stops.join('\n'))}>
            {SAMPLES[si].label} <small>({SAMPLES[si].stops.length} stops)</small>
          </button>
          <span className="dots" aria-hidden>{SAMPLES.map((_, i) => <i key={i} className={i === si ? 'on' : ''} />)}</span>
        </div>
        <textarea className="stops" value={text} onChange={e => setText(e.target.value)} aria-label="Delivery stops, one per line"
          placeholder={'One stop per line, first line is your start.\nInclude the city or postcode.'} />
        <p className="hint hide-sm">Up to {MAX} stops free. The first line is your start; the rest are reordered nearest-first. Addresses are looked up on OpenStreetMap.</p>
        <button className="btn btn-primary" onClick={run} disabled={busy} style={{ width: '100%' }}>
          {busy ? 'Looking up stops…' : 'Optimize route'}
        </button>
        {err && <p className="err" role="alert">{err}</p>}
      </div>
      <div className="panel fade-up" style={{ animationDelay: '80ms' }}>
        <h2>2. Your route</h2>
        <div className="mapbox"><RouteMap pts={res ? proj(res.route) : DEMO} demo={!res} /></div>
        {!res && <p className="hint hide-sm">Example animation. Your real route appears here.</p>}
        {res && (
          <>
            <div className="kpis">
              <div className="kpi"><b>{res.after.toFixed(1)} km</b><span>Optimized</span></div>
              <div className="kpi"><b>{res.before.toFixed(1)} km</b><span>As entered</span></div>
              <div className="kpi"><b>{saved.toFixed(1)} km</b><span>Shorter</span></div>
            </div>
            <ol className="order">{res.route.map((p, i) => <li key={i}><span className="n">{i + 1}</span>{p.q}</li>)}</ol>
            <p className="hint">Straight-line distances, no live traffic. {res.skipped.length ? `Not found, skipped: ${res.skipped.join('; ')}.` : ''}</p>
          </>
        )}
      </div>
    </div>
  )
}
