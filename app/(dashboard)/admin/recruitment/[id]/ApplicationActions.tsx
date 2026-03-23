'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  acceptAndCreateMember,
  rejectApplication,
  deleteApplication,
} from '@/app/actions/admin/recruitment'
import { Check, X, Trash2, AlertCircle } from 'lucide-react'

export default function ApplicationActions({ app }: { app: any }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleAccept() {
    startTransition(async () => {
      const result = await acceptAndCreateMember(app.id)
      if (result.success) {
        setMsg({ type: 'success', text: `Success! Temp password: ${result.tempPassword}` })
      } else {
        setMsg({ type: 'error', text: result.error ?? 'Failed to accept application.' })
      }
    })
  }

  async function handleReject() {
    if (!confirm('Reject this application?')) return
    startTransition(async () => {
      await rejectApplication(app.id)
      router.push('/admin/recruitment')
      router.refresh()
    })
  }

  async function handleDelete() {
    if (!confirm('Permanently delete this application?')) return
    startTransition(async () => {
      await deleteApplication(app.id)
      router.push('/admin/recruitment')
      router.refresh()
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
      {msg && (
        <div style={{ 
          background: msg.type === 'success' ? '#E6F4EA' : '#FEEBE9',
          color: msg.type === 'success' ? '#137333' : '#A32D2D',
          padding: '12px 16px', borderRadius: 8, fontSize: '0.85rem',
          fontWeight: 600, maxWidth: 300, border: `1px solid ${msg.type === 'success' ? '#34A853' : '#EA4335'}40`
        }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        {app.status === 'pending' && (
          <>
            <button
              onClick={handleAccept}
              disabled={isPending}
              style={{ background: '#34A853', color: '#fff', border: 'none',
                padding: '10px 20px', borderRadius: 8, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Check size={18} /> Accept
            </button>
            <button
              onClick={handleReject}
              disabled={isPending}
              style={{ background: '#EA4335', color: '#fff', border: 'none',
                padding: '10px 20px', borderRadius: 8, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <X size={18} /> Reject
            </button>
          </>
        )}
        
        {app.status !== 'pending' && (
          <button
            onClick={handleDelete}
            disabled={isPending}
            style={{ background: '#fff', color: '#EA4335', border: '1px solid #EA4335',
              padding: '10px 20px', borderRadius: 8, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Trash2 size={18} /> Delete Application
          </button>
        )}
      </div>
      
      {isPending && (
        <p style={{ color: '#5F6368', fontSize: '0.8rem', margin: 0 }}>Processing...</p>
      )}
    </div>
  )
}
