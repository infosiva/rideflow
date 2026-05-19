import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

let _g: Groq | null = null
function g() { if (!_g) _g = new Groq({ apiKey: process.env.GROQ_API_KEY! }); return _g }

export async function POST(req: NextRequest) {
  try {
    const { messages, system } = await req.json()
    const res = await g().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: system ?? 'You are RideFlow AI — a ride booking assistant. Help users book rides, estimate fares, understand ride types, and answer questions about the service. Be concise and helpful.' }, ...messages],
      max_tokens: 400,
    })
    return NextResponse.json({ text: res.choices[0]?.message?.content ?? 'Happy to help with your ride!' })
  } catch {
    return NextResponse.json({ text: 'Use the booking form above to get started!' }, { status: 200 })
  }
}
