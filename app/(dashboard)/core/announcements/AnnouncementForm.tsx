'use client'

import { createAnnouncement } from '@/app/actions/announcements'
import { useActionState, useEffect, useRef } from 'react'
import { Plus, Send, AlertCircle } from 'lucide-react'

export function AnnouncementForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, isPending] = useActionState(createAnnouncement, undefined)

  useEffect(() => {
    if (state === undefined && !isPending) {
        formRef.current?.reset()
    }
  }, [state, isPending])

  return (
    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 12, border: '1px solid #e0e0e0', marginTop: 32 }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Plus size={18} color="#4285F4" /> Create Announcement
      </h3>
      
      <form ref={formRef} action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <input 
            name="title" 
            placeholder="Announcement title..." 
            required 
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
          />
          <select 
            name="audience" 
            required
            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none', background: '#fff' }}
          >
            <option value="all">All Users</option>
            <option value="member">Members Only</option>
            <option value="core">Core Team Only</option>
          </select>
        </div>
        
        <textarea 
          name="body" 
          placeholder="Write your message here..." 
          required 
          rows={3}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none', resize: 'vertical' }}
        />

        {state && (
          <p style={{ color: '#EA4335', fontSize: '0.85rem', fontWeight: 600 }}>{state}</p>
        )}

        <button 
          type="submit" 
          disabled={isPending}
          style={{ 
            background: '#4285F4', color: '#fff', padding: '12px', borderRadius: 8, border: 'none', fontWeight: 700, cursor: isPending ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}
        >
          {isPending ? 'Sending...' : <><Send size={16} /> Post Announcement</>}
        </button>
      </form>
    </div>
  )
}
