import { prisma } from '@/lib/prisma'

export async function getDashboardData(memberId: string) {
  // First get the member to check role
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    select: {
      id: true,
      name: true,
      slug: true,
      role: true,
      tier: true,
      imageUrl: true,
      points: true,
      department: true,
      createdAt: true,
    },
  })

  if (!member) return null

  const isAdmin = member.role === 'admin'
  const isCore  = member.role === 'core' || isAdmin

  const [
    eventsAttended,
    certificatesEarned,
    announcements,
    memberResources,
    recentRegistrations,
    clubMembership,
    // Add conditional management stats
    managementStats,
  ] = await Promise.all([

    prisma.eventRegistration.count({
      where: { memberId },
    }),

    prisma.eventRegistration.count({
      where: {
        memberId,
        attendedAt: { not: null },
      },
    }),

    prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),

    prisma.resourceTrack.findMany({
      orderBy: { name: 'asc' },
      take: 3,
      select: { id: true, name: true, tag: true, tagColor: true, description: true },
    }),

    prisma.eventRegistration.findMany({
      where: { memberId },
      include: { event: { select: { title: true, slug: true, date: true, type: true } } },
      orderBy: { event: { date: 'desc' } },
      take: 3,
    }),

    prisma.clubMembership.findFirst({
      where: { memberId },
      include: { club: true },
    }),

    // Management stats fetched only if role allows
    isCore ? Promise.all([
      prisma.event.count(),
      prisma.post.count(),
      prisma.recruitmentApplication.count({ where: { status: 'pending' } }),
      isAdmin ? prisma.member.count() : Promise.resolve(0),
    ]) : Promise.resolve([0, 0, 0, 0]),

  ])

  return {
    member,
    eventsAttended,
    certificatesEarned,
    announcements,
    memberResources,
    recentRegistrations,
    clubMembership,
    managementStats: isCore ? {
      totalEvents: managementStats[0],
      totalPosts:  managementStats[1],
      pendingApps: managementStats[2],
      totalMembers: managementStats[3],
    } : null,
  }
}
