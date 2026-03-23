import { requireAuth } from '@/lib/auth-guard'
import SecurityTab from '../components/SecurityTab'

export default async function SecurityPage() {
  const session = await requireAuth()
  return <SecurityTab memberId={session.user.id} />
}
