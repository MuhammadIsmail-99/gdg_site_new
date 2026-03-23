'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Search } from 'lucide-react'

export function EventSearch() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (term) params.set('search', term)
    else       params.delete('search')
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, 300)

  return (
    <div className="search-wrapper">
      <input
        defaultValue={searchParams.get('search') ?? ''}
        onChange={e => handleSearch(e.target.value)}
        placeholder="Search for a city or region"
      />
      <button className="search-btn"><Search size={20} /></button>
    </div>
  )
}
