'use server'

import { auth }           from '@/auth'
import { prisma }         from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z }              from 'zod'

function isCoreOrAdmin(role: string) {
  return role === 'core' || role === 'admin'
}

const announcementSchema = z.object({
  title:    z.string().min(3).max(200),
  body:     z.string().min(5).max(1000),
  audience: z.enum(['member', 'core', 'all']),
})

export async function createAnnouncement(
  prevState: string | undefined,
  formData: FormData,
) {
  const session = await auth()
  if (!session?.user || !isCoreOrAdmin(session.user.role)) {
    return 'Unauthorized'
  }

  const parsed = announcementSchema.safeParse({
    title:    formData.get('title'),
    body:     formData.get('body'),
    audience: formData.get('audience'),
  })

  if (!parsed.success) {
    return parsed.error.issues.map(i => i.message).join(', ')
  }

  await prisma.announcement.create({
    data: { ...parsed.data, isActive: true },
  })

  revalidatePath('/core/announcements')
  revalidatePath('/dashboard')
  return undefined
}

export async function toggleAnnouncement(id: string) {
  const session = await auth()
  if (!session?.user || !isCoreOrAdmin(session.user.role)) return

  const a = await prisma.announcement.findUnique({
    where: { id }, select: { isActive: true },
  })
  if (!a) return

  await prisma.announcement.update({
    where: { id },
    data:  { isActive: !a.isActive },
  })

  revalidatePath('/core/announcements')
  revalidatePath('/dashboard')
}

export async function deleteAnnouncement(id: string) {
  const session = await auth()
  if (!session?.user || !isCoreOrAdmin(session.user.role)) return

  await prisma.announcement.delete({ where: { id } })
  revalidatePath('/core/announcements')
  revalidatePath('/dashboard')
}
