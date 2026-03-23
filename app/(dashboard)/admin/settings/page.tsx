import { requireRole } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'
import { SettingsTabs } from './SettingsTabs'
import { SystemHealth } from './SystemHealth'

export default async function AdminSettingsPage() {
  await requireRole(['admin'])

  const [
    settings,
    partners,
    clubs,
    memberCount,
    eventCount,
    postCount,
    partnerCount,
    clubCount,
    settingCount,
    announcementCount,
  ] = await Promise.all([
    prisma.siteSetting.findMany(),
    prisma.partner.findMany({ orderBy: { order: 'asc' } }),
    prisma.club.findMany({ orderBy: { type: 'asc' } }),
    prisma.member.count({ where: { isActive: true } }),
    prisma.event.count({ where: { isPublished: true } }),
    prisma.post.count({ where: { isPublished: true } }),
    prisma.partner.count(),
    prisma.club.count(),
    prisma.siteSetting.count(),
    prisma.announcement.count({ where: { isActive: true } }),
  ])

  const settingsMap = Object.fromEntries(
    settings.map(s => [s.key, s.value])
  )

  const stats = {
    memberCount,
    eventCount,
    postCount,
    partnerCount,
    clubCount,
    settingCount,
    announcementCount,
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8, color: '#202124' }}>
        System Configuration
      </h1>
      <p style={{ color: '#5F6368', marginBottom: 40, fontSize: '0.95rem' }}>
        Manage global settings, community partners, specialized interest clubs, and view site-wide system audit logs.
      </p>

      {/* Tabs section */}
      <SettingsTabs
        settingsMap={settingsMap}
        partners={partners}
        clubs={clubs}
      />

      {/* System Health Overview */}
      <SystemHealth stats={stats} />
    </div>
  )
}
