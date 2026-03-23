'use server'

import { auth }           from '@/auth'
import { prisma }         from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect }       from 'next/navigation'
import { z }              from 'zod'

function isCoreOrAdmin(role: string) {
  return role === 'core' || role === 'admin'
}

const eventSchema = z.object({
  title:       z.string().min(3).max(200),
  description: z.string().min(10),
  type:        z.string().min(2),
  location:    z.string().min(2),
  date:        z.string().refine(d => !isNaN(Date.parse(d)), 'Invalid date'),
  badgeUrl:    z.string().url().optional().or(z.literal('')),
  imageUrl:    z.string().url().optional().or(z.literal('')),
  isPublished: z.boolean().optional().default(false),
})

export async function createEvent(
  prevState: string | undefined,
  formData: FormData,
) {
  const session = await auth()
  if (!session?.user || !isCoreOrAdmin(session.user.role)) {
    return 'Unauthorized'
  }

  const tagsInput = (formData.get('tags') as string ?? '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)

  const agendaRaw  = formData.get('agenda') as string ?? '[]'
  let agendaItems = []
  try {
    agendaItems = JSON.parse(agendaRaw)
  } catch (e) {
    console.error('Failed to parse agenda:', e)
  }

  const parsed = eventSchema.safeParse({
    title:       formData.get('title'),
    description: formData.get('description'),
    type:        formData.get('type'),
    location:    formData.get('location'),
    date:        formData.get('date'),
    badgeUrl:    formData.get('badgeUrl'),
    imageUrl:    formData.get('imageUrl'),
    isPublished: formData.get('isPublished') === 'true',
  })

  if (!parsed.success) {
    return parsed.error.issues.map(i => i.message).join(', ')
  }

  const slug = parsed.data.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80) + '-' + Date.now().toString(36)

  await prisma.event.create({
    data: {
      ...parsed.data,
      slug,
      date:  new Date(parsed.data.date),
      tags: {
        create: tagsInput.map(tag => ({ tag }))
      },
      agendaItems: {
        create: agendaItems.map((item: any, i: number) => ({
          time:        item.time,
          title:       item.title,
          description: item.description || '',
          speaker:     item.speaker     || '',
          order:       i,
        }))
      },
    },
  })

  revalidatePath('/events')
  revalidatePath('/core/events')
  redirect('/core/events')
}

export async function updateEvent(
  id: string,
  prevState: string | undefined,
  formData: FormData,
) {
  const session = await auth()
  if (!session?.user || !isCoreOrAdmin(session.user.role)) {
    return 'Unauthorized'
  }

  const tagsInput = (formData.get('tags') as string ?? '')
    .split(',').map(t => t.trim()).filter(Boolean)

  const agendaRaw   = formData.get('agenda') as string ?? '[]'
  let agendaItems = []
  try {
    agendaItems = JSON.parse(agendaRaw)
  } catch (e) {
    console.error('Failed to parse agenda:', e)
  }

  const parsed = eventSchema.safeParse({
    title:       formData.get('title'),
    description: formData.get('description'),
    type:        formData.get('type'),
    location:    formData.get('location'),
    date:        formData.get('date'),
    badgeUrl:    formData.get('badgeUrl'),
    imageUrl:    formData.get('imageUrl'),
    isPublished: formData.get('isPublished') === 'true',
  })

  if (!parsed.success) {
    return parsed.error.issues.map(i => i.message).join(', ')
  }

  await prisma.$transaction([
    prisma.eventTag.deleteMany({ where: { eventId: id } }),
    prisma.eventAgendaItem.deleteMany({ where: { eventId: id } }),
    prisma.event.update({
      where: { id },
      data: {
        ...parsed.data,
        date: new Date(parsed.data.date),
        tags: {
          create: tagsInput.map(tag => ({ tag }))
        },
        agendaItems: {
          create: agendaItems.map((item: any, i: number) => ({
            time:        item.time,
            title:       item.title,
            description: item.description || '',
            speaker:     item.speaker     || '',
            order:       i,
          }))
        },
      },
    }),
  ])

  revalidatePath('/events')
  revalidatePath(`/events/${id}`)
  revalidatePath('/core/events')
  redirect('/core/events')
}

export async function toggleEventPublish(id: string) {
  const session = await auth()
  if (!session?.user || !isCoreOrAdmin(session.user.role)) return

  const event = await prisma.event.findUnique({
    where: { id }, select: { isPublished: true },
  })
  if (!event) return

  await prisma.event.update({
    where: { id },
    data:  { isPublished: !event.isPublished },
  })

  revalidatePath('/events')
  revalidatePath('/core/events')
}

export async function deleteEvent(id: string) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') return

  await prisma.event.delete({ where: { id } })
  revalidatePath('/events')
  revalidatePath('/core/events')
}
