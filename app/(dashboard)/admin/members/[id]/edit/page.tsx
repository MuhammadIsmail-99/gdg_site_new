import { requireRole } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'
import { notFound }    from 'next/navigation'
import MemberForm      from '../../new/MemberForm'
import { RoleChanger } from '../../MemberTableComponents'

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  await requireRole(['admin'])

  const member = await prisma.member.findUnique({
    where: { id },
  })

  if (!member) notFound()

  return (
    <div>
      <div style={{ marginBottom: 32, padding: 24, background: '#FEEBE9', borderRadius: 12, border: '1px solid #EA4335' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 12px 0', color: '#EA4335' }}>Quick Actions</h3>
        <RoleChanger memberId={member.id} currentRole={member.role} />
      </div>

      <MemberForm member={member} mode="edit" />
    </div>
  )
}
