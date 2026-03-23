'use server'

import { auth }           from '@/auth'
import { prisma }         from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z }              from 'zod'

async function requireCoreOrAdmin() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  // @ts-ignore - role exists in our custom session but might not be in the default types
  if (!['core', 'admin'].includes(session.user.role)) {
    throw new Error('Unauthorized')
  }
  return session
}

const trackSchema = z.object({
  name:        z.string().min(2).max(100),
  tag:         z.string().min(2).max(50),
  tagColor:    z.string().regex(/^#[0-9A-Fa-f]{6}$/,
                 'Must be a valid hex color e.g. #4285F4'),
  description: z.string().min(5).max(300),
})

export async function createTrack(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await requireCoreOrAdmin()

    const parsed = trackSchema.safeParse({
      name:        formData.get('name'),
      tag:         formData.get('tag'),
      tagColor:    formData.get('tagColor'),
      description: formData.get('description'),
    })

    if (!parsed.success) {
      return parsed.error.issues.map(i => i.message).join(', ')
    }

    await prisma.resourceTrack.create({ data: parsed.data })

    revalidatePath('/resources')
    revalidatePath('/core/resources')
    return undefined
  } catch (err: any) {
    return err.message
  }
}

export async function updateTrack(
  id: string,
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await requireCoreOrAdmin()

    const parsed = trackSchema.safeParse({
      name:        formData.get('name'),
      tag:         formData.get('tag'),
      tagColor:    formData.get('tagColor'),
      description: formData.get('description'),
    })

    if (!parsed.success) {
      return parsed.error.issues.map(i => i.message).join(', ')
    }

    await prisma.resourceTrack.update({ where: { id }, data: parsed.data })

    revalidatePath('/resources')
    revalidatePath('/core/resources')
    return undefined
  } catch (err: any) {
    return err.message
  }
}

export async function deleteTrack(id: string) {
  await requireCoreOrAdmin()
  await prisma.resourceTrack.delete({ where: { id } })
  revalidatePath('/resources')
  revalidatePath('/core/resources')
}

const stepSchema = z.object({
  stepNum:     z.string().min(1).max(20),
  title:       z.string().min(2).max(100),
  description: z.string().min(5).max(300),
  order:       z.number().int().min(0),
})

export async function addTrackStep(
  trackId: string,
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await requireCoreOrAdmin()

    const parsed = stepSchema.safeParse({
      stepNum:     formData.get('stepNum'),
      title:       formData.get('title'),
      description: formData.get('description'),
      order:       Number(formData.get('order') ?? 0),
    })

    if (!parsed.success) {
      return parsed.error.issues.map(i => i.message).join(', ')
    }

    await prisma.resourceTrackStep.create({
      data: { ...parsed.data, trackId },
    })

    revalidatePath('/resources')
    revalidatePath('/core/resources')
    return undefined
  } catch (err: any) {
    return err.message
  }
}

export async function deleteTrackStep(id: string) {
  await requireCoreOrAdmin()
  await prisma.resourceTrackStep.delete({ where: { id } })
  revalidatePath('/resources')
  revalidatePath('/core/resources')
}

const platformSchema = z.object({
  name:        z.string().min(2).max(100),
  url:         z.string().url(),
  description: z.string().min(5).max(200),
  order:       z.number().int().min(0).optional().default(0),
})

export async function createPlatform(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await requireCoreOrAdmin()

    const parsed = platformSchema.safeParse({
      name:        formData.get('name'),
      url:         formData.get('url'),
      description: formData.get('description'),
      order:       Number(formData.get('order') ?? 0),
    })

    if (!parsed.success) {
      return parsed.error.issues.map(i => i.message).join(', ')
    }

    await prisma.resourcePlatform.create({ data: parsed.data })

    revalidatePath('/resources')
    revalidatePath('/core/resources')
    return undefined
  } catch (err: any) {
    return err.message
  }
}

export async function updatePlatform(
  id: string,
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await requireCoreOrAdmin()

    const parsed = platformSchema.safeParse({
      name:        formData.get('name'),
      url:         formData.get('url'),
      description: formData.get('description'),
      order:       Number(formData.get('order') ?? 0),
    })

    if (!parsed.success) {
      return parsed.error.issues.map(i => i.message).join(', ')
    }

    await prisma.resourcePlatform.update({ where: { id }, data: parsed.data })

    revalidatePath('/resources')
    revalidatePath('/core/resources')
    return undefined
  } catch (err: any) {
    return err.message
  }
}

export async function deletePlatform(id: string) {
  await requireCoreOrAdmin()
  await prisma.resourcePlatform.delete({ where: { id } })
  revalidatePath('/resources')
  revalidatePath('/core/resources')
}

const toolSchema = z.object({
  name:     z.string().min(1).max(100),
  url:      z.string().url().optional().or(z.literal('')),
  toolType: z.string().min(1).max(50),
  order:    z.number().int().min(0).optional().default(0),
})

export async function addTool(
  categoryId: string,
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await requireCoreOrAdmin()

    const parsed = toolSchema.safeParse({
      name:     formData.get('name'),
      url:      formData.get('url')  || '',
      toolType: formData.get('toolType'),
      order:    Number(formData.get('order') ?? 0),
    })

    if (!parsed.success) {
      return parsed.error.issues.map(i => i.message).join(', ')
    }

    await prisma.resourceTool.create({
      data: { ...parsed.data, categoryId },
    })

    revalidatePath('/resources')
    revalidatePath('/core/resources')
    return undefined
  } catch (err: any) {
    return err.message
  }
}

export async function deleteTool(id: string) {
  await requireCoreOrAdmin()
  await prisma.resourceTool.delete({ where: { id } })
  revalidatePath('/resources')
  revalidatePath('/core/resources')
}
