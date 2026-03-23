'use client'

import { deleteEvent } from '@/app/actions/events'
import { useState }           from 'react'
import { Trash2 } from 'lucide-react'

export function EventDeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this event?')) return
    setLoading(true)
    try {
      await deleteEvent(id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        background: 'none',
        border: 'none',
        color: '#EA4335',
        cursor: loading ? 'wait' : 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Trash2 size={16} />
    </button>
  )
}
