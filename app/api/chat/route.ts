import { sanitizeUserInput } from '@/lib/guard'
import { NextRequest, NextResponse } from 'next/server'

// 60 req/hr/IP (in-memory, per instance)
const hits = new Map<string, { n: number; reset: number }>()
function limited(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown'
  const now = Date.now(), e = hits.get(ip)
  if (!e || now > e.reset) { hits.set(ip, { n: 1, reset: now + 3_600_000 }); return false }
  return ++e.n > 60
}

const SYSTEM = `You are the RideFlow assistant. RideFlow is a free multi-stop route planner for independent drivers and couriers: the user pastes stops, it orders them nearest-neighbour to cut drive distance. Answer only about route planning, delivery stops, drive-time and fuel saving, and using RideFlow. If asked anything else, reply exactly: "I'm trained for RideFlow. For that, try Google or ChatGPT!" Be concise (under 80 words). Never claim features RideFlow lacks (no live traffic, no booking, no drivers marketplace).`

type Msg = { role: string; content: string }
const FALLBACK = 'The assistant is busy right now. Paste your stops into the planner and press Optimize route, or try again in a minute.'

async function ask(url: string, key: string, model: string, messages: Msg[]) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages, max_tokens: 300 }),
    signal: AbortSignal.timeout(8000),
  })
  if (!r.ok) throw new Error(String(r.status))
  const j = await r.json()
  const t = j.choices?.[0]?.message?.content
  if (!t) throw new Error('empty')
  return String(t)
}

export async function POST(req: NextRequest) {
  if (limited(req)) return NextResponse.json({ text: 'Rate limit reached (60 messages/hour). Please try again later.' })
  let msgs: Msg[] = []
  try {
    const b = await req.json()
    msgs = (Array.isArray(b.messages) ? b.messages : []).slice(-8).map((m: Msg) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: sanitizeUserInput(String(m.content ?? '')).text.slice(0, 1000) }))
  } catch {}
  if (!msgs.length) return NextResponse.json({ text: FALLBACK })
  const messages = [{ role: 'system', content: SYSTEM }, ...msgs]
  // free chain: Groq -> Gemini -> Cerebras
  const chain: [string | undefined, string, string][] = [
    [process.env.GROQ_API_KEY, 'https://api.groq.com/openai/v1/chat/completions', 'llama-3.3-70b-versatile'],
    [process.env.GEMINI_API_KEY, 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', 'gemini-2.0-flash'],
    [process.env.CEREBRAS_API_KEY, 'https://api.cerebras.ai/v1/chat/completions', 'llama3.1-8b'],
  ]
  for (const [key, url, model] of chain) {
    if (!key) continue
    try { return NextResponse.json({ text: await ask(url, key, model, messages) }) } catch {}
  }
  return NextResponse.json({ text: FALLBACK })
}
