'use client'
import { useState } from 'react'

export default function PromoBox() {
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  async function apply() {
    if (!code.trim()) return
    try {
      const r = await fetch('/api/promo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })
      const j = await r.json()
      setMsg(j.valid ? `Code accepted: ${j.daysUnlocked} days of ${j.feature} unlocked.` : 'That code is not valid.')
    } catch { setMsg('Could not check the code. Try again.') }
  }
  return (
    <div>
      <div className="promo">
        <input value={code} onChange={e => setCode(e.target.value)} placeholder="Promo code" aria-label="Promo code" />
        <button className="btn btn-primary" style={{ minHeight: 44, padding: '0 16px' }} onClick={apply}>Apply</button>
      </div>
      {msg && <p className="hint" role="status">{msg}</p>}
    </div>
  )
}
