'use client'

import { deletePost } from '@/app/actions/posts'
import { useState }           from 'react'
import { Trash2 } from 'lucide-react'

export function PostDeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post?')) return
    setLoading(true)
    try {
      await deletePost(id)
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
