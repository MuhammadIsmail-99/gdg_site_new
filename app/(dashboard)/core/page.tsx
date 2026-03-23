import { requireRole } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'
import Link            from 'next/link'

export default async function CoreOverviewPage() {
  const session = await requireRole(['core', 'admin'])

  const [
    totalEvents,
    upcomingEvents,
    totalPosts,
    draftPosts,
    totalApplications,
    pendingApplications,
    totalMembers,
    activeAnnouncements,
  ] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { date: { gte: new Date() }, isPublished: true } }),
    prisma.post.count(),
    prisma.post.count({ where: { isPublished: false } }),
    prisma.recruitmentApplication.count(),
    prisma.recruitmentApplication.count({ where: { status: 'pending' } }),
    prisma.member.count({ where: { isActive: true } }),
    prisma.announcement.count({ where: { isActive: true } }),
  ])

  const stats = [
    { label: 'Total Events',      value: totalEvents,        href: '/core/events',        color: '#4285F4' },
    { label: 'Upcoming Events',   value: upcomingEvents,     href: '/core/events',        color: '#34A853' },
    { label: 'Total Posts',       value: totalPosts,         href: '/core/blog',          color: '#FBBC04' },
    { label: 'Draft Posts',       value: draftPosts,         href: '/core/blog',          color: '#EA4335' },
    { label: 'Applications',      value: totalApplications,  href: '/admin/recruitment',  color: '#4285F4' },
    { label: 'Pending Review',    value: pendingApplications, href: '/admin/recruitment?status=pending',  color: '#EA4335' },
    { label: 'Active Members',    value: totalMembers,       href: '/admin/members',       color: '#34A853' },
    { label: 'Announcements',     value: activeAnnouncements, href: '/core/announcements', color: '#FBBC04' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>
        Overview Dashboard
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 20,
      }}>
        {stats.map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            style={{
              display: 'block',
              padding: 24,
              background: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: 12,
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            className="stat-card"
          >
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#5F6368', marginBottom: 8, textTransform: 'uppercase' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: stat.color }}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border-color: #4285F4;
        }
      `}} />
    </div>
  )
}
