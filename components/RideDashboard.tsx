'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface DashStats {
  totalRides: number | null
  distanceKm: number | null
  moneySaved: number | null
  avgRating: number | null
}

const STAT_META = [
  {
    key: 'totalRides' as const,
    label: 'Total Rides',
    icon: '🚗',
    format: (v: number) => v.toString(),
    accent: '#2563eb',
    accentRgb: '37,99,235',
  },
  {
    key: 'distanceKm' as const,
    label: 'Distance Covered',
    icon: '🗺️',
    format: (v: number) => `${v} km`,
    accent: '#22c55e',
    accentRgb: '34,197,94',
  },
  {
    key: 'moneySaved' as const,
    label: 'Money Saved',
    icon: '💰',
    format: (v: number) => `₹${v}`,
    accent: '#f59e0b',
    accentRgb: '245,158,11',
  },
  {
    key: 'avgRating' as const,
    label: 'Avg Rating',
    icon: '⭐',
    format: (v: number) => `${v.toFixed(1)}★`,
    accent: '#a78bfa',
    accentRgb: '167,139,250',
  },
]

function loadStats(): DashStats {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('rf_stats') : null
    if (!raw) return { totalRides: null, distanceKm: null, moneySaved: null, avgRating: null }
    return JSON.parse(raw)
  } catch {
    return { totalRides: null, distanceKm: null, moneySaved: null, avgRating: null }
  }
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
}

export default function RideDashboard() {
  const [stats, setStats] = useState<DashStats>({
    totalRides: null,
    distanceKm: null,
    moneySaved: null,
    avgRating: null,
  })

  useEffect(() => {
    setStats(loadStats())
  }, [])

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '20px 20px 0',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        {STAT_META.map(meta => {
          const val = stats[meta.key]
          const display = val !== null ? meta.format(val) : '--'

          return (
            <motion.div
              key={meta.key}
              variants={item}
              whileHover={{ translateY: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.45)' }}
              transition={{ duration: 0.18 }}
              style={{
                background: `rgba(15,27,45,0.85)`,
                border: `1px solid rgba(${meta.accentRgb},0.18)`,
                borderRadius: 14,
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                backdropFilter: 'blur(12px)',
                cursor: 'default',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `rgba(${meta.accentRgb},0.12)`,
                  border: `1px solid rgba(${meta.accentRgb},0.22)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {meta.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: val !== null ? meta.accent : 'rgba(148,163,184,0.4)',
                    letterSpacing: '-0.03em',
                    fontFamily: 'var(--font-display)',
                    lineHeight: 1.1,
                  }}
                >
                  {display}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'rgba(148,163,184,0.6)',
                    marginTop: 2,
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {meta.label}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
