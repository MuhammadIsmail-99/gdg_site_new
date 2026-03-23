import { requireRole } from '@/lib/auth-guard'
import PostForm       from '../PostForm'

export default async function NewPostPage() {
  await requireRole(['core', 'admin'])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>New Blog Post</h1>
      </div>

      <PostForm mode="create" />
    </div>
  )
}
