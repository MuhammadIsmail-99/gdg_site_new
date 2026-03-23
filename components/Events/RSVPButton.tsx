'use client'

import { useState, useEffect } from 'react'
import { useSession }          from 'next-auth/react'
import { useRouter }           from 'next/navigation'
import { Loader2, CalendarCheck, CalendarX, UserCheck } from 'lucide-react'

type RSVPState = {
  registered: boolean
  count:      number
  isPast:     boolean
}

export default function RSVPButton({ slug }: { slug: string }) {
  const { data: session, status } = useSession()
  const router  = useRouter()
  const [state,   setState]   = useState<RSVPState | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

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
    setError('')

    const prev = state

    // Optimistic Update
    setState(s => s
      ? {
          ...s,
          registered: !s.registered,
          count: s.registered ? s.count - 1 : s.count + 1,
        }
      : s
    )

    try {
      const res  = await fetch(`/api/events/${slug}/rsvp`, { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setState(prev)
        setError(data.error ?? 'Something went wrong.')
      } else {
        setState(s => s ? { ...s, registered: data.registered, count: data.count } : s)
      }
    } catch {
      setState(prev)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Loading Skeleton
  if (!state) {
    return (
      <div style={{ 
        height: 60, 
        width: '100%', 
        background: '#f8f9fa', 
        borderRadius: 16,
        border: '1px solid #dadce0',
        animation: 'pulse 1.5s infinite' 
      }} />
    )
  }

  // Past Event State
  if (state.isPast) {
    return (
      <div style={{ 
        padding: '1.5rem', 
        background: '#f8f9fa', 
        borderRadius: '1rem', 
        border: '1px solid #dadce0',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: '#5f6368' }}>
          <CalendarX size={32} />
        </div>
        <p style={{ color: '#5F6368', fontSize: '0.9rem', margin: 0 }}>
          This event has already taken place.
        </p>
        <p style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.5rem', color: '#202124' }}>
          {state.count} {state.count === 1 ? 'person' : 'people'} attended
        </p>
      </div>
    )
  }

  // Unauthenticated State
  if (status === 'unauthenticated') {
    return (
      <div style={{ 
        padding: '1.5rem', 
        background: '#fff', 
        borderRadius: '1rem', 
        border: '1px solid #4285F4',
        textAlign: 'center'
      }}>
        <p style={{ color: '#5F6368', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Join our community to participate in this event.
        </p>
        <button 
          onClick={() => router.push('/login')}
          style={{ 
            background: '#4285F4',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '100px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(66, 133, 244, 0.2)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Sign in to RSVP
        </button>
        <div style={{ 
          fontSize: '0.85rem', 
          color: '#5F6368', 
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <UserCheck size={14} />
          <span>{state.count} registered</span>
        </div>
      </div>
    )
  }

  // Authenticated RSVP State
  return (
    <div style={{ 
        padding: '1.5rem', 
        background: '#fff', 
        borderRadius: '1rem', 
        border: '1px solid #dadce0',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
      <button
        onClick={handleRSVP}
        disabled={loading}
        style={{
          background:    state.registered ? '#fff'     : '#4285F4',
          color:         state.registered ? '#EA4335'  : '#fff',
          border:        state.registered ? '2px solid #EA4335' : 'none',
          padding:       '14px 28px',
          borderRadius:  100,
          fontWeight:    700,
          fontSize:      '1rem',
          cursor:        loading ? 'not-allowed' : 'pointer',
          opacity:       loading ? 0.8 : 1,
          transition:    'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          width:         '100%',
          display:       'flex',
          alignItems:    'center',
          justifyContent: 'center',
          gap:           '10px',
          boxShadow:     state.registered ? 'none' : '0 4px 14px rgba(66, 133, 244, 0.3)'
        }}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : state.registered ? (
          <CalendarX size={20} />
        ) : (
          <CalendarCheck size={20} />
        )}
        
        {loading
          ? 'Processing...'
          : state.registered
            ? 'Cancel Registration'
            : 'Register for Event'}
      </button>

      {error && (
        <p style={{ color: '#EA4335', fontSize: '0.8rem', marginTop: 12, fontWeight: 500 }}>
          {error}
        </p>
      )}

      <div style={{ 
        fontSize: '0.9rem', 
        color: '#5F6368', 
        marginTop: '1.25rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34A853' }}></div>
        {state.count} {state.count === 1 ? 'person' : 'people'} registered
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
