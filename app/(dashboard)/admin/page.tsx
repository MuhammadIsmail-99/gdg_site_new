import { requireRole } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'
import Link            from 'next/link'

export default async function AdminOverviewPage() {
  await requireRole(['admin'])

  const [
    totalMembers,
    activeMembers,
    coreMembers,
    adminMembers,
    totalEvents,
    totalPosts,
    pendingApplications,
    totalApplications,
    activeAnnouncements,
    totalPointsResult,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { isActive: true } }),
    prisma.member.count({ where: { role: 'core', isActive: true } }),
    prisma.member.count({ where: { role: 'admin', isActive: true } }),
    prisma.event.count(),
    prisma.post.count({ where: { isPublished: true } }),
    prisma.recruitmentApplication.count({ where: { status: 'pending' } }),
    prisma.recruitmentApplication.count(),
    prisma.announcement.count({ where: { isActive: true } }),
    prisma.member.aggregate({ _sum: { points: true } }),
  ])

  const totalPoints = totalPointsResult._sum.points || 0

  const stats = [
    { label: 'Total Members',       value: totalMembers,        href: '/admin/members',        color: '#202124' },
    { label: 'Active Members',      value: activeMembers,       href: '/admin/members',        color: '#34A853' },
    { label: 'Core Team',           value: coreMembers,         href: '/admin/members',        color: '#4285F4' },
    { label: 'Total Events',        value: totalEvents,         href: '/core/events',        color: '#4285F4' },
    { label: 'Published Posts',     value: totalPosts,          href: '/core/blog',          color: '#34A853' },
    { label: 'Active Announcements', value: activeAnnouncements, href: '/core/announcements', color: '#FBBC04' },
    { 
      label: 'Pending Review', 
      value: pendingApplications, 
      href: '/admin/recruitment?status=pending', 
      color: pendingApplications > 0 ? '#B45309' : '#FBBC04', 
      bg: pendingApplications > 0 ? '#FEF7E0' : '#fff',
      border: pendingApplications > 0 ? '#FBBC04' : '#e0e0e0'
    },
    { label: 'Total Applications',  value: totalApplications,   href: '/admin/recruitment',    color: '#4285F4', bg: '#fff' },
    { label: 'Points Awarded',      value: totalPoints,         href: '/admin/members',        color: '#B45309', bg: '#fff' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Admin Overview</h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
      }}>
        {stats.map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            style={{
              padding: 24,
              background: stat.bg || '#fff',
              border: `1.5px solid ${stat.border || '#e0e0e0'}`,
              borderRadius: 12,
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'block'
            }}
            className="stat-card"
          >
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#5F6368', marginBottom: 8, textTransform: 'uppercase' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: stat.color, margin: 0 }}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border-color: #EA4335 !important;
        }
      `}} />
    </div>
  )
}
