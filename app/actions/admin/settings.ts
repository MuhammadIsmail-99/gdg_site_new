'use server'

import { auth }           from '@/auth'
import { prisma }         from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z }              from 'zod'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session
}

export async function updateSiteSetting(key: string, value: string) {
  await requireAdmin()

  await prisma.siteSetting.upsert({
    where:  { key },
    update: { value },
    create: { key, value },
  })

  revalidatePath('/admin/settings')
  revalidatePath('/')
  revalidatePath('/join')
}

export async function updateSiteSettings(
  prevState: string | undefined,
  formData: FormData,
) {
  await requireAdmin()

  const keys = [
    'instagram_url',
    'linkedin_url',
    'twitter_url',
    'github_url',
    'chapter_email',
    'chapter_name',
    'chapter_tagline',
    'chapter_location',
    'chapter_founded',
  ]

  const updates = keys
    .map(key => ({ key, value: (formData.get(key) as string ?? '').trim() }))
    .filter(u => u.value !== undefined)

  await Promise.all(
    updates.map(u =>
      prisma.siteSetting.upsert({
        where:  { key: u.key },
        update: { value: u.value },
        create: { key: u.key, value: u.value },
      })
    )
  )

  revalidatePath('/admin/settings')
  revalidatePath('/')
  revalidatePath('/join')
  return undefined
}

const partnerSchema = z.object({
  name:       z.string().min(2).max(100),
  logoUrl:    z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  order:      z.number().int().min(0).optional().default(0),
})

export async function createPartner(
  prevState: string | undefined,
  formData: FormData,
) {
  await requireAdmin()

  const parsed = partnerSchema.safeParse({
    name:       formData.get('name'),
    logoUrl:    formData.get('logoUrl')    || '',
    websiteUrl: formData.get('websiteUrl') || '',
    order:      Number(formData.get('order') ?? 0),
  })

  if (!parsed.success) {
    return parsed.error.issues.map(i => i.message).join(', ')
  }

  await prisma.partner.create({ data: parsed.data })

  revalidatePath('/admin/settings')
  revalidatePath('/')
  return undefined
}

export async function updatePartner(
  id: string,
  prevState: string | undefined,
  formData: FormData,
) {
  await requireAdmin()

  const parsed = partnerSchema.safeParse({
    name:       formData.get('name'),
    logoUrl:    formData.get('logoUrl')    || '',
    websiteUrl: formData.get('websiteUrl') || '',
    order:      Number(formData.get('order') ?? 0),
  })

  if (!parsed.success) {
    return parsed.error.issues.map(i => i.message).join(', ')
  }

  await prisma.partner.update({ where: { id }, data: parsed.data })

  revalidatePath('/admin/settings')
  revalidatePath('/')
  return undefined
}

export async function deletePartner(id: string) {
  await requireAdmin()
  await prisma.partner.delete({ where: { id } })
  revalidatePath('/admin/settings')
  revalidatePath('/')
}

export async function reorderPartner(id: string, direction: 'up' | 'down') {
  await requireAdmin()

  const partner = await prisma.partner.findUnique({ where: { id } })
  if (!partner) return

  const partners = await prisma.partner.findMany({ orderBy: { order: 'asc' } })
  const index = partners.findIndex(p => p.id === id)

  if (direction === 'up' && index > 0) {
    const prev = partners[index - 1]
    await prisma.$transaction([
      prisma.partner.update({ where: { id }, data: { order: prev.order } }),
      prisma.partner.update({ where: { id: prev.id }, data: { order: partner.order } }),
    ])
  } else if (direction === 'down' && index < partners.length - 1) {
    const next = partners[index + 1]
    await prisma.$transaction([
      prisma.partner.update({ where: { id }, data: { order: next.order } }),
      prisma.partner.update({ where: { id: next.id }, data: { order: partner.order } }),
    ])
  }

  revalidatePath('/admin/settings')
  revalidatePath('/')
}

const clubSchema = z.object({
  name:        z.string().min(2).max(100),
  type:        z.enum(['technical', 'creative']),
  description: z.string().min(10).max(500),
  iconType:    z.string().optional(),
  colorToken:  z.string().optional(),
})

export async function createClub(
  prevState: string | undefined,
  formData: FormData,
) {
  await requireAdmin()

  const parsed = clubSchema.safeParse({
    name:        formData.get('name'),
    type:        formData.get('type'),
    description: formData.get('description'),
    iconType:    formData.get('iconType')   || undefined,
    colorToken:  formData.get('colorToken') || undefined,
  })

  if (!parsed.success) {
    return parsed.error.issues.map(i => i.message).join(', ')
  }

  // @ts-ignore
  await prisma.club.create({ data: parsed.data })

  revalidatePath('/admin/settings')
  revalidatePath('/clubs')
  return undefined
}

export async function updateClub(
  id: string,
  prevState: string | undefined,
  formData: FormData,
) {
  await requireAdmin()

  const parsed = clubSchema.safeParse({
    name:        formData.get('name'),
    type:        formData.get('type'),
    description: formData.get('description'),
    iconType:    formData.get('iconType')   || undefined,
    colorToken:  formData.get('colorToken') || undefined,
  })

  if (!parsed.success) {
    return parsed.error.issues.map(i => i.message).join(', ')
  }

  // @ts-ignore
  await prisma.club.update({ where: { id }, data: parsed.data })

  revalidatePath('/admin/settings')
  revalidatePath('/clubs')
  return undefined
}

export async function deleteClub(id: string) {
  await requireAdmin()
  await prisma.club.delete({ where: { id } })
  revalidatePath('/admin/settings')
  revalidatePath('/clubs')
}
