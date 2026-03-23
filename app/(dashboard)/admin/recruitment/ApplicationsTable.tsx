'use client'

import React, { useState, useTransition, Fragment } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import {
  acceptAndCreateMember,
  rejectApplication,
  deleteApplication,
  bulkUpdateStatus,
} from '@/app/actions/admin/recruitment'
import { ChevronRight, ChevronDown, Check, X, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

type Application = {
  id: string
  name: string
  email: string
  studentId: string | null
  department: string | null
  domains: string
  statement: string | null
  status: string
  createdAt: Date | string
}

export function ApplicationsTable({
  applications,
  total,
  pages,
  currentPage,
  statusFilter,
  searchFilter,
}: {
  applications: Application[]
  total: number
  pages: number
  currentPage: number
  statusFilter: string
  searchFilter: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selected, setSelected] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSearch = useDebouncedCallback(
    (term: string) => updateParam('search', term), 300
  )

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleAll = () =>
    setSelected(prev =>
      prev.length === applications.length
        ? []
        : applications.map(a => a.id)
    )

  async function handleAccept(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    startTransition(async () => {
      const result = await acceptAndCreateMember(id)
      if (result.success) {
        const clubMsg = (result as any).clubAssigned 
          ? `Club: ${(result as any).clubAssigned}. ` 
          : 'No club matched — assign manually. '
        setActionMsg({ 
          type: 'success', 
          text: `Member created. ${clubMsg}Temp password: ${result.tempPassword}` 
        })
      } else {
        setActionMsg({ type: 'error', text: result.error ?? 'Error creating member.' })
      }
    })
  }

  async function handleReject(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm('Reject this application?')) return
    startTransition(() => rejectApplication(id))
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm('Permanently delete this application?')) return
    startTransition(() => deleteApplication(id))
  }

  async function handleBulkReject() {
    if (selected.length === 0) return
    if (!confirm(`Reject ${selected.length} applications?`)) return
    startTransition(async () => {
      await bulkUpdateStatus(selected, 'rejected')
      setSelected([])
    })
  }

  async function handleBulkAccept() {
    if (selected.length === 0) return
    if (!confirm(`Mark ${selected.length} applications as accepted?`)) return
    startTransition(async () => {
      await bulkUpdateStatus(selected, 'accepted')
      setSelected([])
      setActionMsg({ type: 'success', text: `${selected.length} applications marked as accepted.` })
    })
  }

  const statusColor = (s: string) =>
    s === 'accepted' ? { bg: '#E6F4EA', text: '#137333', border: '#34A853' }
      : s === 'rejected' ? { bg: '#FEEBE9', text: '#A32D2D', border: '#EA4335' }
        : { bg: '#FEF7E0', text: '#B45309', border: '#FBBC04' }

  return (
    <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, overflow: 'hidden' }}>
      {/* Action message */}
      {actionMsg && (
        <div style={{
          background: actionMsg.type === 'success' ? '#E6F4EA' : '#FEEBE9',
          color: actionMsg.type === 'success' ? '#137333' : '#A32D2D',
          padding: '12px 20px', borderBottom: '1px solid #e0e0e0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{actionMsg.text}</span>
          <button onClick={() => setActionMsg(null)}
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', color: 'inherit', fontWeight: 700
            }}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Filter row */}
      <div style={{
        padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: 16,
        flexWrap: 'wrap', alignItems: 'center', background: '#fafafa'
      }}>
        <input
          defaultValue={searchFilter}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search name, email, department..."
          style={{
            flex: 1, minWidth: 260, padding: '10px 14px',
            border: '1px solid #dadce0', borderRadius: 8,
            fontSize: '0.9rem', outline: 'none'
          }}
        />
        <select
          value={statusFilter}
          onChange={e => updateParam('status', e.target.value)}
          style={{
            padding: '10px 14px', border: '1px solid #dadce0',
            borderRadius: 8, fontSize: '0.9rem', background: '#fff', outline: 'none'
          }}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Bulk actions */}
        {selected.length > 0 && (
          <div style={{ display: 'flex', gap: 12, paddingLeft: 12, borderLeft: '1px solid #dadce0' }}>
            <span style={{
              fontSize: '0.85rem', color: '#5F6368',
              alignSelf: 'center', fontWeight: 600
            }}>
              {selected.length} selected
            </span>
            <button onClick={handleBulkAccept} disabled={isPending}
              style={{
                background: '#34A853', color: '#fff',
                border: 'none', padding: '8px 16px', borderRadius: 8,
                fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem'
              }}>
              Accept All
            </button>
            <button onClick={handleBulkReject} disabled={isPending}
              style={{
                background: '#EA4335', color: '#fff',
                border: 'none', padding: '8px 16px', borderRadius: 8,
                fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem'
              }}>
              Reject All
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse',
          fontSize: '0.9rem'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0', textAlign: 'left', color: '#5f6368' }}>
              <th style={{ padding: '12px 24px', width: 40 }}>
                <input
                  type="checkbox"
                  checked={selected.length === applications.length && applications.length > 0}
                  onChange={toggleAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th style={{ padding: '12px 12px' }}>Applicant</th>
              <th style={{ padding: '12px 12px' }}>Department</th>
              <th style={{ padding: '12px 12px' }}>Domains</th>
              <th style={{ padding: '12px 12px' }}>Applied</th>
              <th style={{ padding: '12px 12px' }}>Status</th>
              <th style={{ padding: '12px 24px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => {
              const colors = statusColor(app.status)
              const domains = app.domains.split(',').filter(Boolean)
              const isExp = expanded === app.id

              return (
                <Fragment key={app.id}>
                  <tr
                    onClick={() => setExpanded(isExp ? null : app.id)}
                    style={{
                      borderBottom: '1px solid #f8f9fa',
                      background: isExp ? '#E8F0FE' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={e => !isExp && (e.currentTarget.style.background = '#fcfcfc')}
                    onMouseOut={e => !isExp && (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '16px 24px' }} onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.includes(app.id)}
                        onChange={(e) => toggleSelect(app.id, e as any)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {isExp ? <ChevronDown size={16} color="#4285F4" /> : <ChevronRight size={16} color="#dadce0" />}
                        <div>
                          <p style={{ fontWeight: 700, margin: 0, color: '#202124' }}>
                            {app.name}
                          </p>
                          <p style={{ fontSize: '0.8rem', color: '#5F6368', margin: 0 }}>
                            {app.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px', color: '#5F6368' }}>
                      {app.department}
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {domains.slice(0, 2).map(d => (
                          <span key={d} style={{
                            background: '#E8F0FE',
                            color: '#185FA5', padding: '2px 6px',
                            borderRadius: 4, fontSize: '0.75rem',
                            fontWeight: 700, whiteSpace: 'nowrap'
                          }}>
                            {d}
                          </span>
                        ))}
                        {domains.length > 2 && (
                          <span style={{ fontSize: '0.75rem', color: '#5F6368', fontWeight: 600 }}>
                            +{domains.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{
                      padding: '16px 12px', color: '#5F6368',
                      fontSize: '0.85rem'
                    }}>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{
                        background: colors.bg, color: colors.text,
                        padding: '4px 10px', borderRadius: 100,
                        fontSize: '0.75rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.04em'
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        {app.status === 'pending' ? (
                          <>
                            <button
                              onClick={(e) => handleAccept(app.id, e)}
                              disabled={isPending}
                              title="Accept & Create Member"
                              style={{
                                background: '#34A853', color: '#fff',
                                border: 'none', padding: '6px 12px',
                                borderRadius: 6, cursor: 'pointer',
                                fontWeight: 700, fontSize: '0.8rem'
                              }}
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={(e) => handleReject(app.id, e)}
                              disabled={isPending}
                              title="Reject"
                              style={{
                                background: '#EA4335', color: '#fff',
                                border: 'none', padding: '6px 12px',
                                borderRadius: 6, cursor: 'pointer',
                                fontWeight: 700, fontSize: '0.8rem'
                              }}
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={(e) => handleDelete(app.id, e)}
                            disabled={isPending}
                            title="Delete Application"
                            style={{
                              background: '#fff',
                              border: '1px solid #dadce0',
                              padding: '6px 12px', borderRadius: 6,
                              cursor: 'pointer', color: '#EA4335',
                              fontSize: '0.8rem'
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <Link
                          href={`/admin/recruitment/${app.id}`}
                          onClick={e => e.stopPropagation()}
                          title="View Details"
                          style={{ background: '#fff', border: '1px solid #dadce0', padding: '6px 12px', borderRadius: 6, color: '#5f6368' }}
                        >
                          <ExternalLink size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded detail row */}
                  {isExp && (
                    <tr style={{ background: '#E8F0FE', borderBottom: '1px solid #d2e3fc' }}>
                      <td colSpan={7} style={{ padding: '0 24px 24px 56px' }}>
                        <div style={{ maxWidth: 800 }}>
                          <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #d2e3fc', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <p style={{
                              fontSize: '0.75rem', fontWeight: 800,
                              color: '#5F6368', textTransform: 'uppercase',
                              letterSpacing: '.06em', marginBottom: 12
                            }}>
                              Personal Statement
                            </p>
                            <p style={{
                              color: '#202124', lineHeight: 1.8,
                              fontSize: '1rem', margin: '0 0 20px', whiteSpace: 'pre-wrap'
                            }}>
                              {app.statement}
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                              <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 8 }}>
                                <p style={{ fontSize: '0.7rem', color: '#5F6368', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 4px' }}>Student ID</p>
                                <p style={{ margin: 0, fontWeight: 600 }}>{app.studentId || 'N/A'}</p>
                              </div>
                              <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 8 }}>
                                <p style={{ fontSize: '0.7rem', color: '#5F6368', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 4px' }}>All Domains</p>
                                <p style={{ margin: 0, fontWeight: 600 }}>{domains.join(', ')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}

            {applications.length === 0 && (
              <tr>
                <td colSpan={7} style={{
                  padding: '60px', textAlign: 'center',
                  color: '#5F6368'
                }}>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>No applications found.</p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>Try adjusting your search or filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '20px 24px', fontSize: '0.9rem',
        color: '#5F6368', background: '#fafafa', borderTop: '1px solid #f0f0f0'
      }}>
        <span style={{ fontWeight: 600 }}>Showing {applications.length} of {total} results</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            disabled={currentPage <= 1}
            onClick={() => updateParam('page', String(currentPage - 1))}
            style={{
              padding: '8px 16px', border: '1px solid #dadce0',
              borderRadius: 8, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', background: '#fff', opacity: currentPage <= 1 ? 0.5 : 1, fontWeight: 600
            }}
          >
            ← Previous
          </button>
          <button
            disabled={currentPage >= pages}
            onClick={() => updateParam('page', String(currentPage + 1))}
            style={{
              padding: '8px 16px', border: '1px solid #dadce0',
              borderRadius: 8, cursor: currentPage >= pages ? 'not-allowed' : 'pointer', background: '#fff', opacity: currentPage >= pages ? 0.5 : 1, fontWeight: 600
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
