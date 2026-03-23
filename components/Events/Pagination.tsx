'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages:  number
}) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Show at most 7 page buttons; use ellipsis for large ranges
  const buildPageRange = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const delta = 2
    const range: (number | null)[] = []
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i)
      } else if (range[range.length - 1] !== null) {
        range.push(null) // ellipsis sentinel
      }
    }
    return range
  }

  const pages = buildPageRange()

  const btnBase: React.CSSProperties = {
    height:       36,
    minWidth:     36,
    padding:      '0 10px',
    border:       '1px solid #dadce0',
    borderRadius: 8,
    cursor:       'pointer',
    fontSize:     '0.875rem',
    fontWeight:   500,
    fontFamily:   'inherit',
    transition:   'all 0.15s',
    display:      'inline-flex',
    alignItems:   'center',
    justifyContent: 'center',
  }

  return (
    <div style={{
      display:        'flex',
      gap:            6,
      justifyContent: 'center',
      marginTop:      40,
      flexWrap:       'wrap',
      alignItems:     'center',
    }}>
      {/* Previous */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          ...btnBase,
          background:  currentPage === 1 ? '#f8f9fa' : 'white',
          color:       currentPage === 1 ? '#bdc1c6' : '#5f6368',
          cursor:      currentPage === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        ← Prev
      </button>

      {pages.map((p, i) =>
        p === null ? (
          <span key={`ellipsis-${i}`} style={{ color: '#9aa0a6', padding: '0 4px', fontSize: '0.875rem' }}>
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p as number)}
            style={{
              ...btnBase,
              background:  p === currentPage ? '#1a73e8' : 'white',
              color:       p === currentPage ? '#fff'    : '#202124',
              borderColor: p === currentPage ? '#1a73e8' : '#dadce0',
              fontWeight:  p === currentPage ? 700      : 500,
            }}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          ...btnBase,
          background: currentPage === totalPages ? '#f8f9fa' : 'white',
          color:      currentPage === totalPages ? '#bdc1c6' : '#5f6368',
          cursor:     currentPage === totalPages ? 'not-allowed' : 'pointer',
        }}
      >
        Next →
      </button>
    </div>
  )
}
