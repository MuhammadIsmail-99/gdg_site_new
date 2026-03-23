import { requireRole } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'
import { notFound }    from 'next/navigation'
import PostForm       from '../../PostForm'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireRole(['core', 'admin'])

  const post = await prisma.post.findUnique({
    where:   { id },
    include: { tags: true },
  })

  if (!post) notFound()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Edit Blog Post</h1>
      </div>
      <PostForm post={post} mode="edit" />
    </div>
  )
}
