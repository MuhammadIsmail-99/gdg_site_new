import { requireRole } from '@/lib/auth-guard'
import MemberForm      from './MemberForm'

export default async function NewMemberPage() {
  await requireRole(['admin'])

  return <MemberForm mode="create" />
}
