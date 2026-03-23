'use client'

import { useActionState, useTransition } from 'react'
import {
  toggleRecruitmentStatus,
  updateRecruitmentMessage,
} from '@/app/actions/admin/recruitment'

export function RecruitmentStatusControl({
  isOpen,
  message,
  deadline,
}: {
  isOpen:   boolean
  message:  string
  deadline: string
}) {
  const [isPending, startTransition] = useTransition()
  const [msgError, msgDispatch, msgPending] = useActionState(updateRecruitmentMessage, undefined)

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: 12,
      padding: '20px 24px', marginBottom: 24, background: '#fff' }}>

      {/* Status row */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ fontWeight: 700, margin: '0 0 4px' }}>
            Recruitment Status
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width:        8,
              height:       8,
              borderRadius: '50%',
              background:   isOpen ? '#34A853' : '#EA4335',
            }} />
            <span style={{
              fontWeight: 700,
              color:      isOpen ? '#137333' : '#B45309',
              fontSize: '0.9rem'
            }}>
              {isOpen ? 'Open — accepting applications' : 'Closed — not accepting'}
            </span>
          </div>
        </div>

        <button
          onClick={() => startTransition(() => toggleRecruitmentStatus())}
          disabled={isPending}
          style={{
            background:   isOpen ? '#EA4335' : '#34A853',
            color:        '#fff',
            border:       'none',
            padding:      '10px 24px',
            borderRadius: 8,
            fontWeight:   700,
            cursor:       isPending ? 'not-allowed' : 'pointer',
            opacity:      isPending ? 0.7 : 1,
            fontSize:     '0.9rem',
          }}
        >
          {isPending
            ? 'Updating...'
            : isOpen
              ? 'Close Recruitment'
              : 'Open Recruitment'}
        </button>
      </div>

      {/* Message + deadline form */}
      <form action={msgDispatch}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px',
          gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600,
              color: '#5F6368', display: 'block', marginBottom: 4 }}>
              Closed-state message (shown on /join when closed)
            </label>
            <input
              name="message"
              defaultValue={message}
              required
              style={{ width: '100%', padding: '8px 12px',
                border: '1px solid #e0e0e0', borderRadius: 8,
                fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600,
              color: '#5F6368', display: 'block', marginBottom: 4 }}>
              Application deadline
            </label>
            <input
              name="deadline"
              type="date"
              defaultValue={deadline}
              style={{ width: '100%', padding: '8px 12px',
                border: '1px solid #e0e0e0', borderRadius: 8,
                fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
        </div>

        {msgError && (
          <p style={{ color: '#EA4335', fontSize: '0.85rem', marginTop: 8 }}>
            {msgError}
          </p>
        )}

        <button
          type="submit"
          disabled={msgPending}
          style={{ marginTop: 12, background: '#4285F4', color: '#fff',
            border: 'none', padding: '10px 20px', borderRadius: 8,
            fontWeight: 600, cursor: msgPending ? 'not-allowed' : 'pointer',
            opacity: msgPending ? 0.7 : 1, fontSize: '0.875rem' }}
        >
          {msgPending ? 'Saving...' : 'Save Message & Deadline'}
        </button>
      </form>
    </div>
  )
}
