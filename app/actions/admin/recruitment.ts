'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import * as bcrypt from 'bcryptjs'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session
}

export async function updateApplicationStatus(
  id: string,
  status: 'pending' | 'accepted' | 'rejected'
) {
  await requireAdmin()

  await prisma.recruitmentApplication.update({
    where: { id },
    data: { status },
  })

  revalidatePath('/admin/recruitment')
}

import { createId } from '@paralleldrive/cuid2'

const DOMAIN_TO_CLUB_NAME: Record<string, string> = {
  'Web & App Development':    'Web & App Development',
  'Data Science & ML':        'Data Science & ML',
  'Generative AI':            'Generative AI',
  'UI/UX & Design':           'UI/UX & Design',
  'Content & Social Media':   'Content & Social Media',
  'Events & Logistics':       'Events & Logistics',
}

export async function acceptAndCreateMember(applicationId: string) {
  const adminSession = await requireAdmin()

  const app = await prisma.recruitmentApplication.findUnique({
    where: { id: applicationId },
  })
  if (!app) throw new Error('Application not found')

  const existing = await prisma.member.findUnique({
    where: { email: app.email },
  })
  if (existing) {
    await prisma.recruitmentApplication.update({
      where: { id: applicationId },
      data: { status: 'accepted' },
    })
    revalidatePath('/admin/recruitment')
    return {
      success: false,
      error: `A member with email ${app.email} already exists. Marked application as accepted.`,
    }
  }

  // Pre-generate ID for transaction linkage
  const newMemberId = createId()
  
  // Map domain preference to club
  const domains = app.domains.split(',').map(d => d.trim()).filter(Boolean)
  const primaryDomain = domains[0] ?? ''
  const clubName = DOMAIN_TO_CLUB_NAME[primaryDomain]

  let club = null
  if (clubName) {
    club = await prisma.club.findFirst({
      where: { name: { equals: clubName, mode: 'insensitive' } },
    })
  }

  const slug = app.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60) + '-' + createId().slice(0, 6)

  const tempPassword = 'gdgoc' + new Date().getFullYear().toString()
  const passwordHash = await bcrypt.hash(tempPassword, 12)

  await prisma.$transaction([
    prisma.member.create({
      data: {
        id: newMemberId,
        name: app.name,
        email: app.email,
        slug,
        passwordHash,
        role: 'member',
        department: app.department,
        studentId: app.studentId ?? '',
        isActive: true,
        points: 0,
      },
    }),
    prisma.recruitmentApplication.update({
      where: { id: applicationId },
      data: { status: 'accepted' },
    }),
    ...(club ? [prisma.clubMembership.create({
      data: {
        clubId:     club.id,
        memberId:   newMemberId,
        assignedBy: adminSession.user.id,
      }
    })] : []),
  ])

  revalidatePath('/admin/recruitment')
  revalidatePath('/admin/members')
  revalidatePath('/team')
  revalidatePath('/clubs')

  return { 
    success: true, 
    tempPassword, 
    clubAssigned: club?.name ?? null 
  }
}

export async function rejectApplication(id: string) {
  await requireAdmin()

  await prisma.recruitmentApplication.update({
    where: { id },
    data: { status: 'rejected' },
  })

  revalidatePath('/admin/recruitment')
}

export async function deleteApplication(id: string) {
  await requireAdmin()

  await prisma.recruitmentApplication.delete({ where: { id } })
  revalidatePath('/admin/recruitment')
}

export async function bulkUpdateStatus(
  ids: string[],
  status: 'pending' | 'accepted' | 'rejected'
) {
  await requireAdmin()

  await prisma.recruitmentApplication.updateMany({
    where: { id: { in: ids } },
    data: { status },
  })

  revalidatePath('/admin/recruitment')
}

export async function toggleRecruitmentStatus() {
  await requireAdmin()

  const current = await prisma.siteSetting.findUnique({
    where: { key: 'recruitment_status' },
  })

  const newStatus = current?.value === 'open' ? 'closed' : 'open'

  await prisma.siteSetting.upsert({
    where: { key: 'recruitment_status' },
    update: { value: newStatus },
    create: { key: 'recruitment_status', value: newStatus },
  })

  revalidatePath('/admin/recruitment')
  revalidatePath('/join')
}

export async function updateRecruitmentMessage(
  prevState: string | undefined,
  formData: FormData,
) {
  await requireAdmin()

  const message = formData.get('message') as string
  const deadline = formData.get('deadline') as string

  if (!message?.trim()) return 'Message cannot be empty.'

  await Promise.all([
    prisma.siteSetting.upsert({
      where: { key: 'recruitment_message' },
      update: { value: message },
      create: { key: 'recruitment_message', value: message },
    }),
    prisma.siteSetting.upsert({
      where: { key: 'recruitment_deadline' },
      update: { value: deadline ?? '' },
      create: { key: 'recruitment_deadline', value: deadline ?? '' },
    }),
  ])

  revalidatePath('/join')
  revalidatePath('/admin/recruitment')
  return undefined
}
