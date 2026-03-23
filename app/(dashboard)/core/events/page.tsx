import { requireRole } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'
import { PublishToggle } from './PublishToggle'
import { EventDeleteButton } from './DeleteButton'
import Link            from 'next/link'

export default async function CoreEventsPage() {
  const session = await requireRole(['core', 'admin'])
  const isAdmin = session.user.role === 'admin'

  const events = await prisma.event.findMany({
    include: {
      tags:   true,
      _count: { select: { registrations: true } },
    },
    orderBy: { date: 'desc' },
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Events</h1>
        <Link href="/core/events/new"
          style={{ background: '#4285F4', color: '#fff', padding: '10px 20px',
            borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
          + New Event
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse',
        fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
            <th style={{ padding: '10px 8px' }}>Title</th>
            <th style={{ padding: '10px 8px' }}>Date</th>
            <th style={{ padding: '10px 8px' }}>Type</th>
            <th style={{ padding: '10px 8px' }}>Status</th>
            <th style={{ padding: '10px 8px' }}>RSVPs</th>
            <th style={{ padding: '10px 8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}
              style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '12px 8px', fontWeight: 500 }}>
                {event.title}
              </td>
              <td style={{ padding: '12px 8px', color: '#5F6368' }}>
                {new Date(event.date).toLocaleDateString('en-PK', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </td>
              <td style={{ padding: '12px 8px' }}>
                <span style={{ background: '#E8F0FE', color: '#185FA5',
                  padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem',
                  fontWeight: 700 }}>
                  {event.type}
                </span>
              </td>
              <td style={{ padding: '12px 8px' }}>
                <span style={{
                  background: event.isPublished ? '#E6F4EA' : '#FEF7E0',
                  color:      event.isPublished ? '#137333' : '#B45309',
                  padding: '2px 8px', borderRadius: 4,
                  fontSize: '0.75rem', fontWeight: 700,
                }}>
                  {event.isPublished ? 'Published' : 'Draft'}
                </span>
              </td>
              <td style={{ padding: '12px 8px', color: '#5F6368' }}>
                {event._count.registrations}
              </td>
              <td style={{ padding: '12px 8px' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Link href={`/core/events/${event.id}/edit`}
                    style={{ color: '#4285F4', textDecoration: 'none',
                      fontSize: '0.85rem' }}>
                    Edit
                  </Link>
                  <PublishToggle
                    id={event.id}
                    isPublished={event.isPublished}
                  />
                  {isAdmin && <EventDeleteButton id={event.id} />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
