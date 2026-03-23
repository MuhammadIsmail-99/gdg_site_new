'use client'

import React, { useState, useTransition, useActionState } from 'react'
import {
  createClub,
  updateClub,
  deleteClub,
} from '@/app/actions/admin/settings'
import { Pencil, Trash2, Plus, Code, Palette, Box } from 'lucide-react'

type Club = {
  id:          string
  name:        string
  type:        'technical' | 'creative'
  description: string
  iconType:    string | null
  colorToken:  string | null
}

export function ClubsTab({ clubs }: { clubs: Club[] }) {
  const [editing,    setEditing]    = useState<string | null>(null)
  const [showForm,   setShowForm]   = useState(false)
  const [isPending,  startTransition] = useTransition()

  return (
    <div style={{ maxWidth: 840 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 32, background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e0e0e0' }}>
        <div>
           <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Special Interest Clubs</h2>
           <p style={{ margin: '4px 0 0', color: '#5F6368', fontSize: '0.9rem' }}>
            {clubs.length} active learning tracks for our members.
           </p>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          style={{ 
            background: showForm ? '#f1f3f4' : '#EA4335', 
            color: showForm ? '#202124' : '#fff', 
            border: 'none',
            padding: '10px 24px', borderRadius: 10, fontWeight: 700,
            cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> Add Club</>}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <ClubForm
          mode="create"
          onSuccess={() => setShowForm(false)}
        />
      )}

      {/* Clubs grouped list */}
      {['technical', 'creative'].map(type => {
         const filtered = clubs.filter(c => c.type === type)
         return (
           <div key={type} style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                 {type === 'technical' ? <Code size={20} color="#4285F4" /> : <Palette size={20} color="#34A853" />}
                 <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#202124', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {type === 'technical' ? 'Technical Learning Tracks' : 'Creative & Design Tracks'}
                 </h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
                 {filtered.map(club => (
                   <div key={club.id}>
                    {editing === club.id ? (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <ClubForm
                          mode="edit"
                          club={club}
                          onSuccess={() => setEditing(null)}
                        />
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column',
                        padding: 24, background: '#fff', borderRadius: 16, border: `1.5px solid ${club.colorToken || '#e0e0e0'}`, position: 'relative', overflow: 'hidden' }}>
                        
                        <div style={{ position: 'absolute', top: 0, left: 0, width: 6, height: '100%', background: club.colorToken || '#e0e0e0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                           <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#202124' }}>{club.name}</h4>
                           <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 100, background: '#f8f9fa', color: '#5f6368', textTransform: 'uppercase' }}>
                            {club.iconType || 'track'}
                           </span>
                        </div>
                        
                        <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: '#5F6368', lineHeight: 1.6, flex: 1 }}>
                          {club.description}
                        </p>

                        <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                          <button
                            onClick={() => setEditing(club.id)}
                            style={{ background: '#fff', border: '1px solid #dadce0', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', color: '#4285F4', fontWeight: 600, fontSize: '0.85rem' }}>
                            <Pencil size={14} style={{ marginRight: 4 }} /> Edit
                          </button>
                          <DeleteConfirmButton
                            isPending={isPending}
                            onConfirm={() => startTransition(() => deleteClub(club.id))}
                          />
                        </div>
                      </div>
                    )}
                   </div>
                 ))}
                 {filtered.length === 0 && (
                   <div style={{ padding: 20, background: '#fafafa', borderRadius: 12, border: '1px solid #f0f0f0', gridColumn: '1 / -1' }}>
                      <p style={{ margin: 0, color: '#5f6368', fontSize: '0.9rem', textAlign: 'center' }}>No {type} clubs available.</p>
                   </div>
                 )}
              </div>
           </div>
         )
      })}
    </div>
  )
}

function ClubForm({
  mode,
  club,
  onSuccess,
}: {
  mode:       'create' | 'edit'
  club?:      Club
  onSuccess:  () => void
}) {
  const [error,      setError]    = useState<string | undefined>(undefined)
  const [isPending,  startTransition] = useTransition()
  const [colorValue, setColorValue]   = useState(club?.colorToken || '#4285F4')

  const action = mode === 'create' ? createClub : updateClub.bind(null, club!.id)

  return (
    <form
      action={async (formData) => {
        setError(undefined)
        startTransition(async () => {
          const result = await action(undefined, formData)
          if (!result) onSuccess()
          else setError(result)
        })
      }}
      style={{ background: '#fff', border: '2px solid #EA4335',
        borderRadius: 16, padding: 32, marginBottom: 20, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}
    >
      <h3 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', fontWeight: 800, color: '#EA4335' }}>
        {mode === 'create' ? 'Define New Learning Track' : `Edit ${club?.name}`}
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 24 }}>
        <div style={{ gridColumn: 'span 1' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#5F6368', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Club Name</label>
          <input name="name" defaultValue={club?.name || ''} required style={{ width: '100%', padding: '12px 14px', border: '1px solid #dadce0', borderRadius: 10, fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }} />
        </div>

        <div style={{ gridColumn: 'span 1' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#5F6368', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Club Type</label>
          <select name="type" defaultValue={club?.type || 'technical'} style={{ width: '100%', padding: '12px 14px', border: '1px solid #dadce0', borderRadius: 10, fontSize: '0.95rem', background: '#fff' }}>
             <option value="technical">Technical Track</option>
             <option value="creative">Creative / Design Track</option>
          </select>
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#5F6368', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Description</label>
          <textarea name="description" defaultValue={club?.description || ''} rows={4} required style={{ width: '100%', padding: '12px 14px', border: '1px solid #dadce0', borderRadius: 10, fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#5F6368', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Icon (e.g. code, palette, layout)</label>
          <input name="iconType" defaultValue={club?.iconType || ''} placeholder="track" style={{ width: '100%', padding: '12px 14px', border: '1px solid #dadce0', borderRadius: 10, fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }} />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#5F6368', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Brand Color</label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
             <div style={{ width: 44, height: 44, borderRadius: 10, background: colorValue, border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
             <input name="colorToken" value={colorValue} onChange={e => setColorValue(e.target.value)} placeholder="#4285F4" style={{ flex: 1, padding: '12px 14px', border: '1px solid #dadce0', borderRadius: 10, fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }} />
          </div>
        </div>
      </div>

      {error && (
        <p style={{ color: '#EA4335', fontSize: '0.9rem', fontWeight: 600,
          marginBottom: 20 }}>
          ⚠ {error}
        </p>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" disabled={isPending}
          style={{ background: '#4285F4', color: '#fff', border: 'none',
            padding: '14px 40px', borderRadius: 12, fontWeight: 700,
            cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1,
            fontSize: '1rem', boxShadow: '0 4px 12px rgba(66, 133, 244, 0.2)' }}>
          {isPending ? 'Syncing...' : mode === 'create' ? 'Establish Club' : 'Save Changes'}
        </button>
        <button type="button" onClick={onSuccess}
          style={{ background: '#fff', border: '1px solid #dadce0', padding: '14px 28px', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function DeleteConfirmButton({ onConfirm, isPending }: { onConfirm: () => void, isPending: boolean }) {
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)}
        disabled={isPending}
        style={{ background: '#fff', border: '1px solid #dadce0',
          borderRadius: 8, padding: '8px 16px', cursor: isPending ? 'not-allowed' : 'pointer',
          color: '#EA4335', fontWeight: 600, fontSize: '0.85rem', opacity: isPending ? 0.6 : 1 }}>
        <Trash2 size={14} style={{ marginRight: 4 }} /> Delete
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <button onClick={onConfirm}
        disabled={isPending}
        style={{ background: '#EA4335', color: '#fff', border: 'none',
          borderRadius: 8, padding: '8px 16px', cursor: isPending ? 'not-allowed' : 'pointer',
          fontSize: '0.85rem', fontWeight: 700, opacity: isPending ? 0.7 : 1 }}>
        {isPending ? '...' : 'Confirm'}
      </button>
      <button onClick={() => setConfirming(false)}
        disabled={isPending}
        style={{ background: '#fff', border: '1px solid #dadce0',
          borderRadius: 8, padding: '8px 16px', cursor: isPending ? 'not-allowed' : 'pointer',
          fontSize: '0.85rem', fontWeight: 600 }}>
        No
      </button>
    </div>
  )
}
