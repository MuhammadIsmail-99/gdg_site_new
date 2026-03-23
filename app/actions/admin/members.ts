'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import * as bcrypt from 'bcryptjs'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session
}

const memberSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['member', 'core', 'admin']),
  tier: z.enum(['leadership', 'core', 'domain']).optional(),
  department: z.string().optional(),
  studentId: z.string().optional(),
  tagline: z.string().max(160).optional(),
  bio: z.string().max(1000).optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
})

export async function createMember(
  prevState: string | undefined,
  formData: FormData,
) {
  await requireAdmin()

  const parsed = memberSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
    tier: formData.get('tier') || undefined,
    department: formData.get('department') || undefined,
    studentId: formData.get('studentId') || undefined,
    tagline: formData.get('tagline') || undefined,
    bio: formData.get('bio') || undefined,
    linkedin: formData.get('linkedin') || undefined,
    github: formData.get('github') || undefined,
    instagram: formData.get('instagram') || undefined,
  })

  if (!parsed.success) {
    return parsed.error.issues.map(i => i.message).join(', ')
  }

  const existing = await prisma.member.findUnique({
    where: { email: parsed.data.email },
  })
  if (existing) return 'A member with this email already exists.'

  const slug = parsed.data.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60) + '-' + Date.now().toString(36)

  const tempPassword = formData.get('tempPassword') as string || 'gdgoc2026'
  const passwordHash = await bcrypt.hash(tempPassword, 12)

  await prisma.member.create({
    data: {
      ...parsed.data,
      slug,
      passwordHash,
      isActive: true,
      points: 0,
    },
  })

  revalidatePath('/admin/members')
  revalidatePath('/team')
  redirect('/admin/members')
}

export async function updateMember(
  id: string,
  prevState: string | undefined,
  formData: FormData,
) {
  await requireAdmin()

  const parsed = memberSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
    tier: formData.get('tier') || undefined,
    department: formData.get('department') || undefined,
    studentId: formData.get('studentId') || undefined,
    tagline: formData.get('tagline') || undefined,
    bio: formData.get('bio') || undefined,
    linkedin: formData.get('linkedin') || undefined,
    github: formData.get('github') || undefined,
    instagram: formData.get('instagram') || undefined,
  })

  if (!parsed.success) {
    return parsed.error.issues.map(i => i.message).join(', ')
  }

  await prisma.member.update({
    where: { id },
    data: parsed.data,
  })

  revalidatePath('/admin/members')
  revalidatePath('/team')
  revalidatePath(`/team/${id}`)
  redirect('/admin/members')
}

export async function toggleMemberStatus(memberId: string) {
  await requireAdmin()

  const member = await prisma.member.findUnique({
    where: { id: memberId },
    select: { isActive: true },
  })
  if (!member) return

  await prisma.member.update({
    where: { id: memberId },
    data: { isActive: !member.isActive },
  })

  revalidatePath('/admin/members')
  revalidatePath('/team')
}

export async function changeMemberRole(memberId: string, role: 'member' | 'core' | 'admin') {
  await requireAdmin()

  await prisma.member.update({
    where: { id: memberId },
    data: { role },
  })

  revalidatePath('/admin/members')
}

export async function awardPoints(memberId: string, amount: number) {
  await requireAdmin()

  if (amount === 0) return
  if (Math.abs(amount) > 1000) return

  await prisma.member.update({
    where: { id: memberId },
    data: { points: { increment: amount } },
  })

  revalidatePath('/admin/members')
  revalidatePath('/dashboard')
}

export async function resetMemberPassword(memberId: string) {
  await requireAdmin()

  const newPassword = 'gdgoc2026'
  const passwordHash = await bcrypt.hash(newPassword, 12)

  await prisma.member.update({
    where: { id: memberId },
    data: { passwordHash },
  })

  return { success: true, tempPassword: newPassword }
}

export async function deleteMember(memberId: string) {
  const session = await requireAdmin()

  if (session?.user.id === memberId) {
    throw new Error('Cannot delete your own account.')
  }

  await prisma.member.delete({ where: { id: memberId } })

  revalidatePath('/admin/members')
  revalidatePath('/team')
}

export async function markAttended(registrationId: string) {
  await requireAdmin()

  await prisma.eventRegistration.update({
    where: { id: registrationId },
    data: { attendedAt: new Date() },
  })

  revalidatePath('/admin/members')
}

export async function assignMemberToClub(
  memberId: string,
  clubId:   string,
) {
  const session = await requireAdmin()

  await prisma.clubMembership.upsert({
    where:  { memberId },
    update: {
      clubId,
      assignedAt: new Date(),
      assignedBy: session.user.id,
    },
    create: {
      memberId,
      clubId,
      assignedAt: new Date(),
      assignedBy: session.user.id,
    },
  })

  revalidatePath(`/admin/members/${memberId}`)
  revalidatePath('/admin/members')
  revalidatePath('/clubs')
  revalidatePath('/team')
}

export async function removeMemberFromClub(memberId: string) {
  await requireAdmin()

  await prisma.clubMembership.deleteMany({ where: { memberId } })

  revalidatePath(`/admin/members/${memberId}`)
  revalidatePath('/admin/members')
  revalidatePath('/clubs')
}
