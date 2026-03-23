import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return session
}

export async function requireRole(allowed: string[]) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (!allowed.includes(session.user.role)) redirect('/dashboard')
  return session
}
