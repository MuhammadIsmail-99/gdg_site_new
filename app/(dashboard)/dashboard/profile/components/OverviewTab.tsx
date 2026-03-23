'use client'

import React, { useTransition, useState } from 'react'
import {
  Github,
  Linkedin,
  Instagram,
  ExternalLink,
  Upload,
} from 'lucide-react'
import Link from 'next/link'
import { uploadAvatar } from '@/app/actions/profile'

interface OverviewTabProps {
  member: any
}

export default function OverviewTab({ member }: OverviewTabProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState(member.imageUrl)

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    startTransition(async () => {
      const result = await uploadAvatar(formData)
      if (result.error) {
        setError(result.error)
      } else if (result.url) {
        setCurrentUrl(result.url)
        setError(null)
      }
    })
  }

  const infoFields = [
    { label: 'Bio', value: member.bio || 'No bio provided' },
    { label: 'Department', value: member.department || '—' },
    { label: 'Student ID', value: member.studentId || '—' },
    { label: 'Events Attended', value: String(member._count?.eventRegistrations || 0) },
    { label: 'Member Since', value: new Date(member.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }) },
    { label: 'LinkedIn', value: member.linkedin || '—' },
    { label: 'GitHub', value: member.github || '—' },
    { label: 'Instagram', value: member.instagram || '—' },
  ]

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Section header + avatar/name row */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        gap: 24, marginBottom: 32, paddingBottom: 32,
        borderBottom: '1px solid #e8eaed'
      }}>

        {/* Avatar with upload button */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {currentUrl ? (
            <img src={currentUrl} alt=""
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E8F0FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.75rem', color: '#185FA5', border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {member.name.charAt(0)}
            </div>
          )}
          
          <label style={{
            position: 'absolute', bottom: -4, right: -4,
            background: '#fff', border: '1px solid #dadce0',
            borderRadius: '50%', width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: isPending ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            opacity: isPending ? 0.7 : 1,
          }}>
            <Upload size={14} color="#5F6368" />
            <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={isPending} style={{ display: 'none' }} />
          </label>
          
          {error && <p style={{ position: 'absolute', top: 84, left: 0, width: 200, fontSize: '0.7rem', color: '#EA4335', margin: 0 }}>{error}</p>}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 4px', color: '#202124' }}>
                {member.name}
              </h1>
              <p style={{ color: '#5F6368', margin: '0 0 12px', fontSize: '0.9rem' }}>
                {member.tagline || (member.role === 'admin' ? 'Administrator' : member.role === 'core' ? 'Core Team' : 'Community Member')}
              </p>
            </div>
            <Link href="/dashboard/profile/edit" style={{
              padding: '8px 16px', borderRadius: 8, background: '#fff',
              border: '1px solid #dadce0', color: '#3C4043',
              fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
              transition: 'background 0.15s'
            }}>
              Edit Profile
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ background: '#E8F0FE', color: '#185FA5', padding: '2px 10px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
              {member.role}
            </span>
            {member.tier && (
              <span style={{ background: '#F1F3F4', color: '#3C4043', padding: '2px 10px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600 }}>
                {member.tier}
              </span>
            )}
            {(() => {
              const membership = (member as any).clubMemberships;
              const item = Array.isArray(membership) ? membership[0] : membership;
              const club = item?.club;
              if (!club) return null;
              return (
                <span style={{ 
                  background: (club.colorToken ?? '#34A853') + '15', 
                  color: club.colorToken ?? '#137333', 
                  padding: '2px 10px', 
                  borderRadius: 100, 
                  fontSize: '0.75rem', 
                  fontWeight: 600 
                }}>
                  {club.name}
                </span>
              );
            })()}
            <span style={{ background: '#FEF7E0', color: '#B05E27', padding: '2px 10px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600 }}>
              {member.points} Points
            </span>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 16, marginBottom: 40
      }}>
        {infoFields.map(({ label, value }) => (
          <div key={label} style={{
            background: '#fafafa', border: '1px solid #f0f0f0',
            padding: '16px 20px', borderRadius: 12
          }}>
            <p style={{
              fontSize: '0.75rem', color: '#5F6368',
              margin: '0 0 6px', textTransform: 'uppercase',
              fontWeight: 700, letterSpacing: '.04em'
            }}>
              {label}
            </p>
            <p style={{ margin: 0, fontWeight: 500, color: '#202124', fontSize: '0.95rem', wordBreak: 'break-word' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Skills section */}
      {member.skills?.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#5F6368', marginBottom: 12 }}>
            Technical Expertise
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {member.skills.map((s: any) => (
              <span key={s.id} style={{
                background: '#E8F0FE', color: '#185FA5', padding: '6px 14px',
                borderRadius: 100, fontSize: '0.85rem', fontWeight: 500
              }}>
                {s.skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contributions section */}
      {member.contributions?.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#5F6368', marginBottom: 12 }}>
            Chapter Contributions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {member.contributions.map((c: any) => (
              <div key={c.id} style={{
                padding: '16px 20px', background: '#fafafa', border: '1px solid #f0f0f0',
                borderRadius: 12
              }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 600, color: '#202124' }}>{c.title}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#5F6368' }}>{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
