import { requireAuth } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'
import { notFound }    from 'next/navigation'
import OverviewTab     from './components/OverviewTab'

export default async function ProfilePage() {
  const session = await requireAuth()

  const member = await prisma.member.findUnique({
    where: { id: session.user.id },
    include: {
      skills:          { orderBy: { skill: 'asc' } },
      contributions:   true,
      clubMemberships: { include: { club: true }, take: 1 },
      _count:          { select: { eventRegistrations: true } },
    },
  })

  if (!member) notFound()

  return <OverviewTab member={member} />
}
