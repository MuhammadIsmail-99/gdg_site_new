'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export function BlogTagFilter({
  tags,
  activeTag,
}: {
  tags: string[]
  activeTag: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function selectTag(tag: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (activeTag === tag) params.delete('tag')
    else params.set('tag', tag)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  if (tags.length === 0) return null

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 32,
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#5f6368',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginRight: 4,
        }}
      >
        Filter:
      </span>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => selectTag(tag)}
          style={{
            background: activeTag === tag ? '#4285F4' : '#f1f3f4',
            color: activeTag === tag ? '#fff' : '#202124',
            border: activeTag === tag ? '1.5px solid #4285F4' : '1.5px solid transparent',
            padding: '5px 16px',
            borderRadius: 100,
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: activeTag === tag ? 700 : 500,
            transition: 'all 0.18s ease',
            outline: 'none',
          }}
        >
          {tag}
        </button>
      ))}
      {activeTag && (
        <button
          onClick={() => selectTag(activeTag)}
          style={{
            background: 'transparent',
            border: '1.5px solid #ea4335',
            color: '#ea4335',
            padding: '5px 14px',
            borderRadius: 100,
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 600,
            transition: 'all 0.18s ease',
          }}
        >
          ✕ Clear filter
        </button>
      )}
    </div>
  )
}
