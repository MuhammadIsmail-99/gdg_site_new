'use client'

import React, { useState, useTransition, useActionState } from 'react'
import {
  createPartner,
  updatePartner,
  deletePartner,
  reorderPartner,
} from '@/app/actions/admin/settings'
import { MoveUp, MoveDown, Pencil, Trash2, Plus, Globe, ExternalLink } from 'lucide-react'

type Partner = {
  id:         string
  name:       string
  logoUrl:    string | null
  websiteUrl: string | null
  order:      number
}

export function PartnersTab({ partners }: { partners: Partner[] }) {
  const [editing,    setEditing]    = useState<string | null>(null)
  const [showForm,   setShowForm]   = useState(false)
  const [isPending,  startTransition] = useTransition()

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24, background: '#fff', padding: 20, borderRadius: 12, border: '1px solid #e0e0e0' }}>
        <div>
           <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Community Partners</h2>
           <p style={{ margin: '4px 0 0', color: '#5F6368', fontSize: '0.9rem' }}>
            {partners.length} active partners shown on the homepage.
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
          {showForm ? 'Cancel' : <><Plus size={18} /> Add Partner</>}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <PartnerForm
          mode="create"
          onSuccess={() => setShowForm(false)}
        />
      )}

      {/* Partners list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {partners.map((partner, index) => (
          <div key={partner.id}>
            {editing === partner.id ? (
              <PartnerForm
                mode="edit"
                partner={partner}
                onSuccess={() => setEditing(null)}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center',
                gap: 16, padding: '16px 20px', background: '#fff',
                borderRadius: 12, border: '1px solid #e0e0e0', transition: 'box-shadow 0.2s' }}>
                <div style={{ width: 60, height: 60, borderRadius: 8, background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f0f0f0' }}>
                  {partner.logoUrl ? (
                    <img src={partner.logoUrl} alt={partner.name}
                      style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                  ) : (
                    <Globe size={24} color="#dadce0" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 800, margin: 0, fontSize: '1.05rem', color: '#202124' }}>
                    {partner.name}
                  </p>
                  {partner.websiteUrl && (
                    <a href={partner.websiteUrl} target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.8rem', color: '#4285F4',
                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontWeight: 500 }}>
                      <ExternalLink size={12} /> {partner.websiteUrl}
                    </a>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                   <div style={{ display: 'flex', background: '#f8f9fa', borderRadius: 8, padding: 4 }}>
                      <button
                        onClick={() => startTransition(() => reorderPartner(partner.id, 'up'))}
                        disabled={index === 0 || isPending}
                        title="Move Up"
                        style={{ background: 'none', border: 'none', borderRadius: 6, padding: 8, cursor: (index === 0 || isPending) ? 'not-allowed' : 'pointer', color: '#5F6368', opacity: (index === 0 || isPending) ? 0.3 : 1 }}>
                        <MoveUp size={16} />
                      </button>
                      <button
                        onClick={() => startTransition(() => reorderPartner(partner.id, 'down'))}
                        disabled={index === partners.length - 1 || isPending}
                        title="Move Down"
                        style={{ background: 'none', border: 'none', borderRadius: 6, padding: 8, cursor: (index === partners.length - 1 || isPending) ? 'not-allowed' : 'pointer', color: '#5F6368', opacity: (index === partners.length - 1 || isPending) ? 0.3 : 1 }}>
                        <MoveDown size={16} />
                      </button>
                   </div>
                  <button
                    onClick={() => setEditing(partner.id)}
                    style={{ background: '#fff', border: '1px solid #dadce0', borderRadius: 10, padding: '10px', cursor: 'pointer', color: '#4285F4' }}>
                    <Pencil size={18} />
                  </button>
                  <DeleteConfirmButton
                    isPending={isPending}
                    onConfirm={() => startTransition(() => deletePartner(partner.id))}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {partners.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fafafa', borderRadius: 16, border: '2px dashed #e0e0e0' }}>
            <Globe size={48} color="#dadce0" style={{ marginBottom: 16 }} />
            <p style={{ color: '#5F6368', margin: 0, fontWeight: 600 }}>No partners configured yet.</p>
            <p style={{ color: '#5F6368', fontSize: '0.85rem', marginTop: 4 }}>Add your community sponsors and collaborators.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function PartnerForm({
  mode,
  partner,
  onSuccess,
}: {
  mode:       'create' | 'edit'
  partner?:   Partner
  onSuccess:  () => void
}) {
  const [error,      setError]    = useState<string | undefined>(undefined)
  const [isPending,  startTransition] = useTransition()

  const action = mode === 'create' ? createPartner : updatePartner.bind(null, partner!.id)

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
        borderRadius: 12, padding: 24, marginBottom: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}
    >
      <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: 800, color: '#EA4335' }}>
        {mode === 'create' ? 'Add New Partner' : 'Edit Partner Info'}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: 16, marginBottom: 24 }}>
        {[
          { name: 'name',       label: 'Partner Name',        defaultValue: partner?.name        ?? '' },
          { name: 'websiteUrl', label: 'Website (https://...)', defaultValue: partner?.websiteUrl  ?? '' },
          { name: 'logoUrl',    label: 'Logo (https://...)',    defaultValue: partner?.logoUrl     ?? '' },
          { name: 'order',      label: 'Sort Order',       defaultValue: String(partner?.order ?? 0) },
        ].map(f => (
          <div key={f.name}>
            <label style={{ fontSize: '0.8rem', fontWeight: 800,
              color: '#5F6368', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {f.label}
            </label>
            <input
              name={f.name}
              defaultValue={f.defaultValue}
              required={f.name === 'name'}
              style={{ width: '100%', padding: '12px 14px',
                border: '1px solid #dadce0', borderRadius: 8,
                fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
        ))}
      </div>

      {error && (
        <p style={{ color: '#EA4335', fontSize: '0.85rem', fontWeight: 600,
          marginBottom: 16 }}>
          ⚠ {error}
        </p>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" disabled={isPending}
          style={{ background: '#4285F4', color: '#fff', border: 'none',
            padding: '12px 28px', borderRadius: 10, fontWeight: 700,
            cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1,
            fontSize: '0.9rem' }}>
          {isPending ? 'Saving...' : mode === 'create' ? 'Create Partner' : 'Save Changes'}
        </button>
        <button type="button" onClick={onSuccess}
          style={{ background: '#fff', border: '1px solid #dadce0', padding: '12px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
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
          borderRadius: 10, padding: 10, cursor: isPending ? 'not-allowed' : 'pointer',
          color: '#EA4335', opacity: isPending ? 0.6 : 1 }}>
        <Trash2 size={18} />
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <button onClick={onConfirm}
        disabled={isPending}
        style={{ background: '#EA4335', color: '#fff', border: 'none',
          borderRadius: 8, padding: '10px 16px', cursor: isPending ? 'not-allowed' : 'pointer',
          fontSize: '0.85rem', fontWeight: 700, opacity: isPending ? 0.7 : 1 }}>
        {isPending ? '...' : 'Confirm'}
      </button>
      <button onClick={() => setConfirming(false)}
        disabled={isPending}
        style={{ background: '#fff', border: '1px solid #dadce0',
          borderRadius: 8, padding: '10px 16px', cursor: isPending ? 'not-allowed' : 'pointer',
          fontSize: '0.85rem', fontWeight: 600 }}>
        No
      </button>
    </div>
  )
}
