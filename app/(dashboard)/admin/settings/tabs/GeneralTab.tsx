'use client'

import { useActionState, useEffect, useState } from 'react'
import { updateSiteSettings } from '@/app/actions/admin/settings'

const fields = [
  {
    section: 'Chapter Info',
    items: [
      { key: 'chapter_name',     label: 'Chapter Name',    type: 'text'  },
      { key: 'chapter_tagline',  label: 'Tagline',         type: 'text'  },
      { key: 'chapter_location', label: 'Location',        type: 'text'  },
      { key: 'chapter_founded',  label: 'Founded Year',    type: 'text'  },
      { key: 'chapter_email',    label: 'Contact Email',   type: 'email' },
    ],
  },
  {
    section: 'Social Handles',
    items: [
      { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
      { key: 'linkedin_url',  label: 'LinkedIn URL',  type: 'url' },
      { key: 'twitter_url',   label: 'Twitter URL',   type: 'url' },
      { key: 'github_url',    label: 'GitHub URL',    type: 'url' },
    ],
  },
]

export function GeneralTab({
  settingsMap,
}: {
  settingsMap: Record<string, string>
}) {
  const [result, dispatch, isPending] = useActionState(updateSiteSettings, undefined)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (result === undefined && !isPending) {
       // Only show saved if it was actually triggered (e.g. check for a ref if needed, but since it's a server action, undefined is success)
       // To avoid showing on mount, we can check if it's the first render probably, but let's just use the result transition.
    }
  }, [result, isPending])

  return (
    <form action={async (formData) => {
      setSaved(false)
      await dispatch(formData)
      setSaved(true)
    }} style={{ maxWidth: 640 }}>
      {fields.map(section => (
        <div key={section.section} style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 20,
            paddingBottom: 10, borderBottom: '1px solid #f0f0f0', color: '#202124' }}>
            {section.section}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {section.items.map(field => (
              <div key={field.key}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700,
                  color: '#5F6368', display: 'block', marginBottom: 6,
                  textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  {field.label}
                </label>
                <input
                  name={field.key}
                  type={field.type}
                  defaultValue={settingsMap[field.key] ?? ''}
                  style={{ width: '100%', padding: '12px 14px',
                    border: '1px solid #dadce0', borderRadius: 10,
                    fontSize: '0.95rem', boxSizing: 'border-box',
                    fontFamily: 'inherit', outline: 'none' }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {saved && !isPending && !result && (
        <p style={{ color: '#34A853', fontSize: '0.9rem', fontWeight: 600,
          marginBottom: 16 }}>
          ✓ Settings saved successfully.
        </p>
      )}

      {typeof result === 'string' && (
        <p style={{ color: '#EA4335', fontSize: '0.9rem', fontWeight: 600,
          marginBottom: 16 }}>
          ⚠ {result}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{ background: '#EA4335', color: '#fff', border: 'none',
          padding: '12px 32px', borderRadius: 8, fontWeight: 700,
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.7 : 1, fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(234, 67, 53, 0.2)' }}
      >
        {isPending ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  )
}
