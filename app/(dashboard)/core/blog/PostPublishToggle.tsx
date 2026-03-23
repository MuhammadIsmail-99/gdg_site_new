'use client'

import { togglePostPublish } from '@/app/actions/posts'
import { useState }           from 'react'

export function PostPublishToggle({ id, isPublished }: { id: string, isPublished: boolean }) {
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    try {
      await togglePostPublish(id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      style={{
        background: 'none',
        border: 'none',
        color: isPublished ? '#EA4335' : '#34A853',
        textDecoration: 'underline',
        cursor: loading ? 'wait' : 'pointer',
        fontSize: '0.85rem',
        padding: 0,
      }}
    >
      {loading ? '...' : isPublished ? 'Unpublish' : 'Publish'}
    </button>
  )
}
