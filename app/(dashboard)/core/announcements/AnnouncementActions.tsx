'use client'

import { toggleAnnouncement, deleteAnnouncement } from '@/app/actions/announcements'
import { useState }           from 'react'
import { Trash2, CheckCircle2, XCircle } from 'lucide-react'

export function AnnouncementActions({ id, isActive, isAdmin }: { id: string, isActive: boolean, isAdmin: boolean }) {
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    try {
      await toggleAnnouncement(id)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this announcement?')) return
    setLoading(true)
    try {
      await deleteAnnouncement(id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <button
        onClick={handleToggle}
        disabled={loading}
        title={isActive ? 'Deactivate' : 'Activate'}
        style={{
          background: 'none',
          border: 'none',
          color: isActive ? '#34A853' : '#5F6368',
          cursor: loading ? 'wait' : 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.85rem',
          fontWeight: 600
        }}
      >
        {isActive ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        {isActive ? 'Active' : 'Inactive'}
      </button>

      {isAdmin && (
        <button
          onClick={handleDelete}
          disabled={loading}
          title="Delete"
          style={{
            background: 'none',
            border: 'none',
            color: '#EA4335',
            cursor: loading ? 'wait' : 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  )
}
