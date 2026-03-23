'use client'

import { createMember, updateMember } from '@/app/actions/admin/members'
import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, X, AlertCircle } from 'lucide-react'

export default function MemberForm({ 
  member, 
  mode = 'create' 
}: { 
  member?: any, 
  mode?: 'create' | 'edit' 
}) {
  const router = useRouter()
  const boundAction = mode === 'create' 
    ? createMember 
    : updateMember.bind(null, member?.id)

  const [state, action, isPending] = useActionState(boundAction, undefined)

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          {mode === 'create' ? 'Add New Member' : 'Edit Member'}
        </h1>
        <button 
          type="button" 
          onClick={() => router.back()}
          style={{ background: '#f1f3f4', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <X size={16} /> Cancel
        </button>
      </div>

      <form action={action} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#202124' }}>Full Name *</label>
            <input 
              name="name" 
              defaultValue={member?.name} 
              required 
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#202124' }}>Email *</label>
            <input 
              name="email" 
              type="email" 
              defaultValue={member?.email} 
              required 
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
            />
          </div>

          {mode === 'create' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#202124' }}>Temporary Password</label>
              <input 
                name="tempPassword" 
                defaultValue="gdgoc2026" 
                style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
              />
              <p style={{ fontSize: '0.75rem', color: '#5f6368', margin: 0 }}>Member should change this on first login.</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#202124' }}>Role</label>
            <select 
              name="role" 
              defaultValue={member?.role || 'member'}
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #dadce0', background: '#fff' }}
            >
              <option value="member">Member</option>
              <option value="core">Core Team</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#202124' }}>Tier</label>
            <select 
              name="tier" 
              defaultValue={member?.tier || ''}
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #dadce0', background: '#fff' }}
            >
              <option value="">None</option>
              <option value="leadership">Leadership</option>
              <option value="core">Core</option>
              <option value="domain">Domain</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#202124' }}>Department</label>
            <input 
              name="department" 
              defaultValue={member?.department} 
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#202124' }}>Student ID</label>
            <input 
              name="studentId" 
              defaultValue={member?.studentId} 
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#202124' }}>Tagline</label>
            <input 
              name="tagline" 
              defaultValue={member?.tagline} 
              placeholder="e.g. Aspiring Web Developer"
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#202124' }}>Bio</label>
            <textarea 
              name="bio" 
              defaultValue={member?.bio} 
              rows={4}
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#202124' }}>LinkedIn URL</label>
            <input 
              name="linkedin" 
              defaultValue={member?.linkedin} 
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#202124' }}>GitHub URL</label>
            <input 
              name="github" 
              defaultValue={member?.github} 
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#202124' }}>Instagram URL</label>
            <input 
              name="instagram" 
              defaultValue={member?.instagram} 
              style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
            />
          </div>

        </div>

        {state && (
          <div style={{ marginTop: 24, padding: 12, background: '#FEEBE9', color: '#EA4335', borderRadius: 8, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} /> {state}
          </div>
        )}

        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <button 
            type="submit" 
            disabled={isPending}
            style={{ 
              background: '#4285F4', color: '#fff', padding: '12px 24px', borderRadius: 8, border: 'none', fontWeight: 700, cursor: isPending ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8
            }}
          >
            {isPending ? 'Saving...' : <><Save size={18} /> {mode === 'create' ? 'Create Member' : 'Save Changes'}</>}
          </button>
        </div>
      </form>
    </div>
  )
}
