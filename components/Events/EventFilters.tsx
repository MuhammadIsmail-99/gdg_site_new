'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { ChevronDown } from 'lucide-react'

export function EventFilters({
  types,
  topics,
}: {
  types:  string[]
  topics: string[]
}) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else        params.delete(key)
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  return (
    <>
      <div className="filter-wrapper" style={{ position: 'relative' }}>
        <select
          className="filter-select"
          onChange={e => updateParam('type', e.target.value)}
          value={searchParams.get('type') ?? ''}
          style={{ appearance: 'none', width: '100%', paddingRight: '40px' }}
        >
          <option value="">All types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <ChevronDown size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>

      <div className="filter-wrapper" style={{ position: 'relative' }}>
        <select
          className="filter-select"
          onChange={e => updateParam('topic', e.target.value)}
          value={searchParams.get('topic') ?? ''}
          style={{ appearance: 'none', width: '100%', paddingRight: '40px' }}
        >
          <option value="">All topics</option>
          {topics.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <ChevronDown size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </>
  )
}
