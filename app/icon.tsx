import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="19" r="2" fill="white" opacity="0.85"/>
        <path d="M5 19c0-5 3-7 7-7s7-2 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M15.5 2.5l4 2.5-4 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    </div>
  )
}
