'use server'

import { auth }    from '@/auth'
import { prisma }  from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'

const profileSchema = z.object({
  name:      z.string().min(2).max(100),
  tagline:   z.string().max(160).optional().or(z.literal('')),
  bio:       z.string().max(1000).optional().or(z.literal('')),
  linkedin:  z.string().url().optional().or(z.literal('')),
  github:    z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  department: z.string().optional().or(z.literal('')),
  studentId:  z.string().optional().or(z.literal('')),
})

export async function updateProfile(
  prevState: string | undefined,
  formData: FormData,
) {
  const session = await auth()
  if (!session?.user) return 'Unauthorized'

  const data = {
    name:      formData.get('name'),
    tagline:   formData.get('tagline'),
    bio:       formData.get('bio'),
    linkedin:  formData.get('linkedin'),
    github:    formData.get('github'),
    instagram: formData.get('instagram'),
    department: formData.get('department'),
    studentId:  formData.get('studentId'),
  }

  const parsed = profileSchema.safeParse(data)

  if (!parsed.success) {
    console.error('Validation failed:', parsed.error.format())
    return 'Invalid input. Please check your fields.'
  }

  // Role-based field protection
  const updateData: any = {
    name:      parsed.data.name,
    tagline:   parsed.data.tagline,
    bio:       parsed.data.bio,
    linkedin:  parsed.data.linkedin,
    github:    parsed.data.github,
    instagram: parsed.data.instagram,
  }

  if (session.user.role === 'admin' || session.user.role === 'core') {
    if (parsed.data.department) updateData.department = parsed.data.department
    if (parsed.data.studentId)  updateData.studentId  = parsed.data.studentId
  }

  try {
    await prisma.member.update({
      where: { id: session.user.id },
      data:  updateData,
    })

    revalidatePath('/dashboard/profile')
    revalidatePath('/dashboard/profile/edit')
    revalidatePath('/dashboard/profile/security')
    revalidatePath(`/team/${session.user.slug}`)
    return 'Profile updated successfully.'
  } catch (error) {
    console.error('Update failed:', error)
    return 'Failed to update profile. Possible duplicate Student ID.'
  }
}

export async function addSkill(skill: string) {
  const session = await auth()
  if (!session?.user) return

  await prisma.memberSkill.upsert({
    where:  { memberId_skill: { memberId: session.user.id, skill } },
    update: {},
    create: { memberId: session.user.id, skill },
  })

  revalidatePath('/dashboard/profile')
}

export async function removeSkill(skill: string) {
  const session = await auth()
  if (!session?.user) return

  await prisma.memberSkill.deleteMany({
    where: { memberId: session.user.id, skill },
  })

  revalidatePath('/dashboard/profile')
}

export async function addContribution(title: string, description: string) {
  const session = await auth()
  if (!session?.user) return

  await prisma.memberContribution.create({
    data: { memberId: session.user.id, title, description },
  })

  revalidatePath('/dashboard/profile')
}

export async function removeContribution(id: string) {
  const session = await auth()
  if (!session?.user) return

  await prisma.memberContribution.deleteMany({
    where: { id, memberId: session.user.id },
  })

  revalidatePath('/dashboard/profile')
}

export async function changePassword(
  prevState: string | undefined,
  formData: FormData,
) {
  const session = await auth()
  if (!session?.user) return 'Unauthorized'

  const current = formData.get('currentPassword') as string
  const next    = formData.get('newPassword')     as string
  const confirm = formData.get('confirmPassword') as string

  if (!current || !next || !confirm) return 'All fields are required.'
  if (next !== confirm) return 'New passwords do not match.'
  if (next.length < 8)  return 'Password must be at least 8 characters.'

  const member = await prisma.member.findUnique({
    where:  { id: session.user.id },
    select: { passwordHash: true },
  })
  if (!member) return 'Member not found.'

  const bcrypt = await import('bcryptjs')
  const valid  = await bcrypt.compare(current, member.passwordHash)
  if (!valid) return 'Current password is incorrect.'

  const hash = await bcrypt.hash(next, 12)
  await prisma.member.update({
    where: { id: session.user.id },
    data:  { passwordHash: hash },
  })

  return 'Password changed successfully.'
}

export async function uploadAvatar(formData: FormData) {
  const session = await auth()
  if (!session?.user) return { error: 'Unauthorized' }

  const file = formData.get('avatar') as File
  if (!file || file.size === 0) return { error: 'No file provided' }
  if (file.size > 2 * 1024 * 1024) return { error: 'File must be under 2MB' }
  if (!file.type.startsWith('image/')) return { error: 'Must be an image' }

  const ext      = file.type.split('/')[1]
  const path     = `avatars/${session.user.id}.${ext}`
  const buffer   = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabaseAdmin
    .storage
    .from('member-avatars')
    .upload(path, buffer, {
      contentType: file.type,
      upsert:      true,
    })

  if (uploadError) return { error: uploadError.message }

  const { data } = supabaseAdmin
    .storage
    .from('member-avatars')
    .getPublicUrl(path)

  await prisma.member.update({
    where: { id: session.user.id },
    data:  { imageUrl: data.publicUrl },
  })

  revalidatePath('/dashboard/profile')
  revalidatePath('/dashboard/profile/edit')
  revalidatePath(`/team/${session.user.slug}`)
  return { success: true, url: data.publicUrl }
}
