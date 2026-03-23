'use client'

import { logout } from '@/app/actions/auth'
import { useTransition } from 'react'

export function LogoutButton({ accentColor }: { accentColor: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      style={{
        width:          '100%',
        padding:        '8px 12px',
        marginBottom:   8,
        background:     'none',
        border:         '1px solid #e8eaed',
        borderRadius:   8,
        fontSize:       '0.85rem',
        color:          '#5F6368',
        cursor:         isPending ? 'not-allowed' : 'pointer',
        textAlign:      'left',
        transition:     'all 0.15s',
        opacity:        isPending ? 0.6 : 1,
      }}
    >
      {isPending ? 'Signing out...' : 'Sign out'}
    </button>
  )
}
