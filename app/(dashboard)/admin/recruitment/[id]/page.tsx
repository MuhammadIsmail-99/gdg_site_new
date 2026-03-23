import { requireRole } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'
import { notFound }    from 'next/navigation'
import Link            from 'next/link'
import ApplicationActions from './ApplicationActions'

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireRole(['admin'])

  const app = await prisma.recruitmentApplication.findUnique({
    where: { id },
  })

  if (!app) notFound()

  const domains = app.domains.split(',').filter(Boolean)

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'accepted': return { bg: '#E6F4EA', color: '#137333', border: '#34A853' }
      case 'rejected': return { bg: '#FEEBE9', color: '#A32D2D', border: '#EA4335' }
      default:         return { bg: '#FEF7E0', color: '#B45309', border: '#FBBC04' }
    }
  }
  const statusSty = getStatusStyle(app.status)

  return (
    <div style={{ maxWidth: 840 }}>
      {/* Back link */}
      <Link href="/admin/recruitment"
        style={{ color: '#5F6368', fontSize: '0.9rem',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontWeight: 600 }}>
        ← Back to all applications
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 40, padding: 32, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#202124' }}>
            {app.name}
          </h1>
          <p style={{ color: '#5F6368', margin: '4px 0 12px', fontSize: '1.1rem' }}>{app.email}</p>
          <span style={{ background: statusSty.bg, color: statusSty.color,
            padding: '6px 14px', borderRadius: 100, fontSize: '0.85rem',
            fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: `1px solid ${statusSty.border}40` }}>
            {app.status}
          </span>
        </div>
        <ApplicationActions app={app} />
      </div>

      {/* Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Student ID',  value: app.studentId  ?? '—'  },
          { label: 'Department',  value: app.department ?? '—'  },
          { label: 'Applied At',  value: new Date(app.createdAt).toLocaleString('en-PK', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #e0e0e0',
            padding: '16px 20px', borderRadius: 12 }}>
            <p style={{ fontSize: '0.75rem', color: '#5F6368', margin: '0 0 6px',
              textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              {label}
            </p>
            <p style={{ margin: 0, fontWeight: 600, color: '#202124' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Domains */}
      <div style={{ marginBottom: 32, background: '#fff', border: '1px solid #e0e0e0', padding: 24, borderRadius: 16 }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#5F6368',
          textTransform: 'uppercase', letterSpacing: '.06em',
          marginBottom: 16 }}>
          Desired Domains
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {domains.map(d => (
            <span key={d} style={{ background: '#E8F0FE', color: '#185FA5',
              padding: '8px 16px', borderRadius: 10, fontSize: '0.9rem',
              fontWeight: 700, border: '1px solid #d2e3fc' }}>
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Personal statement */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, padding: 32 }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#5F6368',
          textTransform: 'uppercase', letterSpacing: '.06em',
          marginBottom: 20 }}>
          Personal Statement
        </p>
        <div style={{ 
          background: '#f8f9fa', 
          borderRadius: 12, 
          padding: '24px 28px',
          lineHeight: 1.85, 
          color: '#202124', 
          fontSize: '1.05rem',
          whiteSpace: 'pre-wrap',
          border: '1px solid #f0f0f0'
        }}>
          {app.statement || 'No statement provided.'}
        </div>
      </div>
    </div>
  )
}
