import { NextRequest, NextResponse } from 'next/server'

// Never 500: always answers JSON. Logs, forwards to Telegram if configured.
export async function POST(req: NextRequest) {
  try {
    const b = await req.json().catch(() => ({}))
    const e = {
      type: String(b.type ?? 'General').slice(0, 40),
      rating: Number(b.rating) || undefined,
      message: String(b.message ?? b.text ?? '').slice(0, 1000),
      email: b.email ? String(b.email).slice(0, 200) : undefined,
      page: String(b.page ?? '/').slice(0, 200),
      site: String(b.site ?? 'RideFlow').slice(0, 60),
    }
    if (!e.message.trim()) return NextResponse.json({ ok: false, error: 'message required' }, { status: 400 })
    console.log('[feedback]', e)
    const t = process.env.TELEGRAM_BOT_TOKEN, c = process.env.TELEGRAM_CHAT_ID
    if (t && c) {
      await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: c, text: `[${e.site}] ${e.type} ${e.rating ?? '-'}/5 ${e.page}\n${e.message}${e.email ? `\n${e.email}` : ''}` }),
      }).catch(() => {})
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
