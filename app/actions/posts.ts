'use server'

import { auth }           from '@/auth'
import { prisma }         from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect }       from 'next/navigation'
import { z }              from 'zod'

function isCoreOrAdmin(role: string) {
  return role === 'core' || role === 'admin'
}

const postSchema = z.object({
  title:       z.string().min(5).max(200),
  excerpt:     z.string().max(300).optional(),
  body:        z.string().min(50),
  coverImage:  z.string().url().optional().or(z.literal('')),
  isPublished: z.boolean().optional().default(false),
})

export async function createPost(
  prevState: string | undefined,
  formData: FormData,
) {
  const session = await auth()
  if (!session?.user || !isCoreOrAdmin(session.user.role)) {
    return 'Unauthorized'
  }

  const tags = (formData.get('tags') as string ?? '')
    .split(',').map(t => t.trim()).filter(Boolean)

  const parsed = postSchema.safeParse({
    title:       formData.get('title'),
    excerpt:     formData.get('excerpt'),
    body:        formData.get('body'),
    coverImage:  formData.get('coverImage'),
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

  await prisma.post.create({
    data: {
      ...parsed.data,
      slug,
      authorId: session.user.id,
      tags: tags.length
        ? { create: tags.map(tag => ({ tag })) }
        : undefined,
    },
  })

  revalidatePath('/blog')
  revalidatePath('/core/blog')
  redirect('/core/blog')
}

export async function updatePost(
  id: string,
  prevState: string | undefined,
  formData: FormData,
) {
  const session = await auth()
  if (!session?.user || !isCoreOrAdmin(session.user.role)) {
    return 'Unauthorized'
  }

  const tags = (formData.get('tags') as string ?? '')
    .split(',').map(t => t.trim()).filter(Boolean)

  const parsed = postSchema.safeParse({
    title:       formData.get('title'),
    excerpt:     formData.get('excerpt'),
    body:        formData.get('body'),
    coverImage:  formData.get('coverImage'),
    isPublished: formData.get('isPublished') === 'true',
  })

  if (!parsed.success) {
    return parsed.error.issues.map(i => i.message).join(', ')
  }

  await prisma.$transaction([
    prisma.postTag.deleteMany({ where: { postId: id } }),
    prisma.post.update({
      where: { id },
      data: {
        ...parsed.data,
        tags: tags.length
          ? { create: tags.map(tag => ({ tag })) }
          : undefined,
      },
    }),
  ])

  revalidatePath('/blog')
  revalidatePath(`/blog/${id}`)
  revalidatePath('/core/blog')
  redirect('/core/blog')
}

export async function togglePostPublish(id: string) {
  const session = await auth()
  if (!session?.user || !isCoreOrAdmin(session.user.role)) return

  const post = await prisma.post.findUnique({
    where: { id }, select: { isPublished: true },
  })
  if (!post) return

  await prisma.post.update({
    where: { id },
    data:  { isPublished: !post.isPublished },
  })

  revalidatePath('/blog')
  revalidatePath('/core/blog')
}

export async function deletePost(id: string) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') return

  await prisma.post.delete({ where: { id } })
  revalidatePath('/blog')
  revalidatePath('/core/blog')
}
