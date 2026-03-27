'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

type RSVPState = {
  registered: boolean
  count: number
  isPast: boolean
}

export default function StickyRSVPBar({ 
  slug, 
  dateRange 
}: { 
  slug: string, 
  dateRange: string 
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [state, setState] = useState<RSVPState | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/events/${slug}/rsvp`)
      .then(r => r.json())
      .then(setState)
      .catch(console.error)
  }, [slug])

  async function handleRSVP() {
    if (status !== 'authenticated') {
      router.push('/login')
      return
    }

    if (!state || state.isPast) return
    setLoading(true)

    const prev = state
    setState(s => s ? {
      ...s,
      registered: !s.registered,
      count: s.registered ? s.count - 1 : s.count + 1
    } : s)

    try {
      const res = await fetch(`/api/events/${slug}/rsvp`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) setState(prev)
      else setState(s => s ? { ...s, registered: data.registered, count: data.count } : s)
    } catch {
      setState(prev)
    } finally {
      setLoading(false)
    }
  }

  if (!state) return null;

  return (
    <div className="sticky-rsvp-bar">
      <div className="container rsvp-bar-content">
        <div className="rsvp-info">
          <span>{dateRange}</span>
          <span className="info-sep">|</span>
          <span>{state.count} RSVP&apos;d</span>
        </div>
        <button 
          className="btn-rsvp" 
          onClick={handleRSVP}
          disabled={loading || state.isPast}
          style={{ opacity: state.isPast ? 0.6 : 1, cursor: state.isPast ? 'default' : 'pointer' }}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : state.registered ? 'Registered' : 'RSVP'}
        </button>
      </div>

      <style jsx>{`
        .sticky-rsvp-bar {
          background-color: #f1f3f4;
          border-top: 1px solid #dadce0;
          border-bottom: 1px solid #dadce0;
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 12px 0;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .rsvp-bar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .rsvp-info {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          font-weight: 500;
          color: #3c4043;
        }

        .info-sep {
          color: #dadce0;
          font-weight: 300;
        }

        .btn-rsvp {
          background-color: #1a73e8;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 4px;
          font-weight: 500;
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 0.5px;
          cursor: pointer;
          min-width: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-rsvp:hover:not(:disabled) {
          background-color: #1765cc;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .rsvp-bar-content {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}
