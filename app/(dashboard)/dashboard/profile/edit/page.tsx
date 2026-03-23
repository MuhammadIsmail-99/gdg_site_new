import { requireAuth } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'
import { notFound }    from 'next/navigation'
import EditTab         from '../components/EditTab'

export default async function EditProfilePage() {
  const session = await requireAuth()

  const member = await prisma.member.findUnique({
    where:   { id: session.user.id },
    include: {
      skills:        { orderBy: { skill: 'asc' } },
      contributions: true,
    },
  })

  if (!member) notFound()

  return <EditTab member={member} role={session.user.role as any} />
}
