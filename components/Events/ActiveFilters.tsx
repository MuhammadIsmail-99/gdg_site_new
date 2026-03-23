'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export function ActiveFilters() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const search = searchParams.get('search')
  const type   = searchParams.get('type')
  const topic  = searchParams.get('topic')
  const date   = searchParams.get('date')

  const active = [
    search && { key: 'search', label: `"${search}"` },
    type   && { key: 'type',   label: type },
    topic  && { key: 'topic',  label: topic },
    date   && { key: 'date',   label: `📅 ${date}` },
  ].filter(Boolean) as { key: string; label: string }[]

  if (active.length === 0) return null

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function clearAll() {
    router.push(pathname, { scroll: false })
  }

  return (
    <div style={{
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      alignItems: 'center',
      marginBottom: 24,
      padding: '10px 0',
    }}>
      <span style={{ fontSize: '0.8rem', color: '#5F6368', fontWeight: 500 }}>
        Active filters:
      </span>

      {active.map(f => (
        <span
          key={f.key}
          style={{
            display:      'inline-flex',
            alignItems:   'center',
            gap:          6,
            background:   '#E8F0FE',
            color:        '#185FA5',
            padding:      '4px 12px',
            borderRadius: 100,
            fontSize:     '0.8rem',
            fontWeight:   500,
          }}
        >
          {f.label}
          <button
            onClick={() => removeFilter(f.key)}
            aria-label={`Remove ${f.key} filter`}
            style={{
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              color:      '#185FA5',
              padding:    0,
              fontWeight: 700,
              fontSize:   '0.95rem',
              lineHeight: 1,
              display:    'flex',
              alignItems: 'center',
            }}
          >
            ×
          </button>
        </span>
      ))}

      <button
        onClick={clearAll}
        style={{
          background:  'none',
          border:      'none',
          cursor:      'pointer',
          color:       '#EA4335',
          fontSize:    '0.8rem',
          fontWeight:  500,
          padding:     '4px 8px',
          borderRadius: 4,
          transition:  'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#fce8e6')}
        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
      >
        Clear all
      </button>
    </div>
  )
}
