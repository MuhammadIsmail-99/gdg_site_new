import { requireRole } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'
import { AnnouncementForm } from './AnnouncementForm'
import { AnnouncementActions } from './AnnouncementActions'

export default async function CoreAnnouncementsPage() {
  const session = await requireRole(['core', 'admin'])
  const isAdmin = session.user.role === 'admin'

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Announcements</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {announcements.map((a) => (
          <div 
            key={a.id} 
            style={{ 
              background: '#fff', padding: '1.5rem', borderRadius: 12, border: '1px solid #e0e0e0', 
              opacity: a.isActive ? 1 : 0.7, 
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
            }}
          >
            <div style={{ flex: 1, paddingRight: 20 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                 <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{a.title}</h4>
                 <span style={{ 
                    background: a.audience === 'all' ? '#E8F0FE' : a.audience === 'member' ? '#E6F4EA' : '#FEF7E0',
                    color:      a.audience === 'all' ? '#185FA5' : a.audience === 'member' ? '#137333' : '#B45309',
                    padding: '2px 8px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase'
                 }}>
                   {a.audience}
                 </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#5F6368', lineHeight: 1.5 }}>
                {a.body.length > 150 ? a.body.slice(0, 150) + '...' : a.body}
              </p>
              <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#9AA0A6' }}>
                Created on {new Date(a.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <AnnouncementActions id={a.id} isActive={a.isActive} isAdmin={isAdmin} />
          </div>
        ))}
        
        {announcements.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#5F6368', background: '#f8f9fa', borderRadius: 12, border: '1px dashed #dadce0' }}>
            No announcements yet.
          </div>
        )}
      </div>

      <AnnouncementForm />
    </div>
  )
}
