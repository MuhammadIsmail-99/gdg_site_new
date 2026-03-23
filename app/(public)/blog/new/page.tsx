import { requireAuth } from '@/lib/auth-guard'
import NewPostForm     from './NewPostForm'

export const metadata = {
  title: 'Write a Post | GDGoC CUI Wah Blog',
  description: 'Submit a draft blog post to the GDGoC CUI Wah chapter.',
}

export default async function NewPostPage() {
  await requireAuth()
  return <NewPostForm />
}
