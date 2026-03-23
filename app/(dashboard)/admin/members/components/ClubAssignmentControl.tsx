'use client'

import { useState, useTransition } from 'react'
import { assignMemberToClub, removeMemberFromClub } from '@/app/actions/admin/members'

export function ClubAssignmentControl({
  memberId,
  currentClubId,
  allClubs,
}: {
  memberId:     string
  currentClubId: string | null
  allClubs:     { id: string; name: string; type: string }[]
}) {
  const [selectedClub, setSelectedClub] = useState(currentClubId ?? '')
  const [isPending, startTransition]    = useTransition()
  const [message,   setMessage]         = useState('')

  const hasChanged = selectedClub !== (currentClubId ?? '')

  function handleAssign() {
    if (!selectedClub) return
    startTransition(async () => {
      try {
        await assignMemberToClub(memberId, selectedClub)
        setMessage('Club assigned successfully.')
        setTimeout(() => setMessage(''), 3000)
      } catch (err) {
        setMessage('Error assigning club.')
      }
    })
  }

  function handleRemove() {
    if (!confirm('Remove member from this club?')) return
    startTransition(async () => {
      try {
        await removeMemberFromClub(memberId)
        setSelectedClub('')
        setMessage('Club removed.')
        setTimeout(() => setMessage(''), 3000)
      } catch (err) {
        setMessage('Error removing club.')
      }
    })
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <select
        value={selectedClub}
        onChange={e => setSelectedClub(e.target.value)}
        disabled={isPending}
        style={{ padding: '7px 10px', border: '1px solid #e0e0e0',
          borderRadius: 8, fontSize: '0.875rem', minWidth: 180, background: '#fff' }}
      >
        <option value="">— No club —</option>
        {['technical', 'creative'].map(type => (
          <optgroup key={type} label={type === 'technical' ? 'Technical' : 'Creative'}>
            {allClubs
              .filter(c => c.type === type)
              .map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))
            }
          </optgroup>
        ))}
      </select>

      {hasChanged && selectedClub && (
        <button
          onClick={handleAssign}
          disabled={isPending}
          style={{ background: '#4285F4', color: '#fff', border: 'none',
            padding: '7px 16px', borderRadius: 8, fontWeight: 600,
            cursor: isPending ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem', opacity: isPending ? 0.7 : 1 }}
        >
          {isPending ? 'Saving...' : currentClubId ? 'Reassign' : 'Assign'}
        </button>
      )}

      {currentClubId && (
        <button
          onClick={handleRemove}
          disabled={isPending}
          style={{ background: 'none', border: '1px solid #f5c6c6',
            color: '#EA4335', padding: '7px 14px', borderRadius: 8,
            fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}
        >
          Remove
        </button>
      )}

      {message && (
        <span style={{ fontSize: '0.8rem', color: message.includes('Error') ? '#EA4335' : '#137333', fontWeight: 500 }}>
          {message}
        </span>
      )}
    </div>
  )
}
