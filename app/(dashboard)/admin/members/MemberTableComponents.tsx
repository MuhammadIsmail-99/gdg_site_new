'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { awardPoints, toggleMemberStatus, deleteMember, resetMemberPassword, changeMemberRole, markAttended } from '@/app/actions/admin/members'
import { Search, ChevronLeft, ChevronRight, X, Check, Award, ShieldAlert, KeyRound, UserMinus } from 'lucide-react'

// ── ROLE BADGE ───────────────────────────────────────────────────────────────

export function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, any> = {
    member: { background: '#f1f3f4', color: '#5f6368' },
    core:   { background: '#E8F0FE', color: '#185FA5' },
    admin:  { background: '#FEEBE9', color: '#EA4335' },
  }
  const s = styles[role] || styles.member

  return (
    <span style={{
      padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem',
      fontWeight: 700, textTransform: 'uppercase', ...s
    }}>
      {role}
    </span>
  )
}

// ── STATUS BADGE ────────────────────────────────────────────────────────────

export function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span style={{
      background: isActive ? '#E6F4EA' : '#FEEBE9',
      color:      isActive ? '#137333' : '#EA4335',
      padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700
    }}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

// ── MEMBER FILTERS ──────────────────────────────────────────────────────────

export function MemberFilters({ search, role, status }: { search: string, role: string, status: string }) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(search)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  function updateUrl(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, val]) => {
      if (val) params.set(key, val)
      else params.delete(key)
    })
    params.delete('page') // Reset page on filter change
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      updateUrl({ search: val })
    }, 400)
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <Search size={18} color="#5f6368" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          placeholder="Search name, email, or student ID..."
          value={query}
          onChange={handleSearchChange}
          style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
        />
      </div>
      
      <select 
        value={role} 
        onChange={(e) => updateUrl({ role: e.target.value })}
        style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #dadce0', background: '#fff' }}
      >
        <option value="">All Roles</option>
        <option value="member">Members</option>
        <option value="core">Core Team</option>
        <option value="admin">Admins</option>
      </select>

      <select 
        value={status} 
        onChange={(e) => updateUrl({ status: e.target.value })}
        style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #dadce0', background: '#fff' }}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  )
}

// ── AWARD POINTS BUTTON ─────────────────────────────────────────────────────

export function AwardPointsButton({ memberId }: { memberId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    await awardPoints(memberId, Number(points))
    setLoading(false)
    setIsOpen(false)
    setPoints(0)
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{ border: 'none', background: 'none', color: '#B45309', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}
      >
        <Award size={14} /> Points
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fff', border: '1px solid #dadce0', borderRadius: 6, padding: '2px 4px' }}>
      <input 
        type="number" 
        value={points} 
        onChange={(e) => setPoints(Number(e.target.value))}
        style={{ width: 60, border: 'none', outline: 'none', fontSize: '0.8rem' }}
      />
      <button onClick={handleConfirm} disabled={loading} style={{ border: 'none', background: '#34A853', color: '#fff', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}>
        <Check size={14} />
      </button>
      <button onClick={() => setIsOpen(false)} style={{ border: 'none', background: '#EA4335', color: '#fff', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}>
        <X size={14} />
      </button>
    </div>
  )
}

// ── TOGGLE STATUS BUTTON ────────────────────────────────────────────────────

export function ToggleStatusButton({ memberId, isActive }: { memberId: string, isActive: boolean }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    await toggleMemberStatus(memberId)
    setLoading(false)
    setConfirming(false)
  }

  if (!confirming) {
    return (
      <button 
        onClick={() => setConfirming(true)}
        style={{ border: 'none', background: 'none', color: isActive ? '#EA4335' : '#34A853', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
      >
        {isActive ? 'Deactivate' : 'Reactivate'}
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Sure?</span>
      <button onClick={handleToggle} disabled={loading} style={{ border: 'none', background: '#34A853', color: '#fff', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}>
        Yes
      </button>
      <button onClick={() => setConfirming(false)} style={{ border: 'none', background: '#EA4335', color: '#fff', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}>
        No
      </button>
    </div>
  )
}

// ── PAGINATION ─────────────────────────────────────────────────────────────

export function AdminPagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 40, alignItems: 'center' }}>
      <button 
        disabled={currentPage <= 1}
        onClick={() => goTo(currentPage - 1)}
        style={{ border: '1px solid #dadce0', background: '#fff', padding: 8, borderRadius: 8, cursor: currentPage <= 1 ? 'default' : 'pointer', opacity: currentPage <= 1 ? 0.5 : 1 }}
      >
        <ChevronLeft size={18} />
      </button>
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#202124' }}>
        Page {currentPage} of {totalPages}
      </span>
      <button 
        disabled={currentPage >= totalPages}
        onClick={() => goTo(currentPage + 1)}
        style={{ border: '1px solid #dadce0', background: '#fff', padding: 8, borderRadius: 8, cursor: currentPage >= totalPages ? 'default' : 'pointer', opacity: currentPage >= totalPages ? 0.5 : 1 }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}

// ── RESET PASSWORD BUTTON ──────────────────────────────────────────────────

export function ResetPasswordButton({ memberId }: { memberId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleReset() {
    await resetMemberPassword(memberId)
    setResult("Password reset to 'gdgoc2026'")
    setConfirming(false)
  }

  if (result) {
    return <span style={{ color: '#34A853', fontWeight: 600, fontSize: '0.85rem' }}>{result}</span>
  }

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} style={{ background: '#f1f3f4', border: '1px solid #dadce0', padding: '8px 16px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', color: '#202124', display: 'flex', alignItems: 'center', gap: 6 }}>
        <KeyRound size={16} /> Reset Password
      </button>
    )
  }

  return (
    <div style={{ padding: 12, border: '1px solid #dadce0', borderRadius: 8, background: '#fff', display: 'flex', gap: 12, alignItems: 'center' }}>
      <span style={{ fontSize: '0.85rem' }}>Are you sure?</span>
      <button onClick={handleReset} style={{ background: '#EA4335', color: '#fff', padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600 }}>Yes, reset</button>
      <button onClick={() => setConfirming(false)} style={{ background: '#fff', border: '1px solid #dadce0', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
    </div>
  )
}

// ── DELETE MEMBER BUTTON ───────────────────────────────────────────────────

export function DeleteMemberButton({ memberId, name }: { memberId: string, name: string }) {
  const [confirming, setConfirming] = useState(false)
  const [confirmName, setConfirmName] = useState('')
  const router = useRouter()

  async function handleDelete() {
    if (confirmName !== name) return
    await deleteMember(memberId)
    router.push('/admin/members')
  }

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} style={{ background: '#fff', border: '1px solid #EA4335', color: '#EA4335', padding: '8px 16px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
        <UserMinus size={16} /> Delete Member
      </button>
    )
  }

  return (
    <div style={{ padding: 16, border: '1.5px solid #EA4335', borderRadius: 12, background: '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>Type &apos;{name}&apos; to confirm deletion:</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input 
          value={confirmName} 
          onChange={(e) => setConfirmName(e.target.value)}
          placeholder="Type name here"
          style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #dadce0', outline: 'none' }}
        />
        <button 
          onClick={handleDelete} 
          disabled={confirmName !== name}
          style={{ background: '#EA4335', color: '#fff', padding: '6px 12px', borderRadius: 6, border: 'none', cursor: confirmName !== name ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: confirmName !== name ? 0.5 : 1 }}
        >
          Yes, Delete
        </button>
        <button onClick={() => setConfirming(false)} style={{ background: '#fff', border: '1px solid #dadce0', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  )
}

// ── MARK ATTENDED BUTTON ───────────────────────────────────────────────────

export function MarkAttendedButton({ registrationId }: { registrationId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleMark() {
    setLoading(true)
    await markAttended(registrationId)
    setLoading(false)
  }

  return (
    <button 
      onClick={handleMark} 
      disabled={loading}
      style={{ background: '#4285F4', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
    >
      {loading ? '...' : 'Mark Attended'}
    </button>
  )
}

// ── ROLE CHANGER ───────────────────────────────────────────────────────────

export function RoleChanger({ memberId, currentRole }: { memberId: string, currentRole: string }) {
  const [loading, setLoading] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as 'member' | 'core' | 'admin'
    setLoading(true)
    await changeMemberRole(memberId, next)
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#5f6368' }}>Change Role:</label>
      <select 
        defaultValue={currentRole} 
        disabled={loading}
        onChange={handleChange}
        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #dadce0', background: '#fff', cursor: loading ? 'wait' : 'default' }}
      >
        <option value="member">Member</option>
        <option value="core">Core Team</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  )
}
