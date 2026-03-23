import { requireRole } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'
import { PostPublishToggle } from './PostPublishToggle'
import { PostDeleteButton } from './DeleteButton'
import Link            from 'next/link'

export default async function CoreBlogPage() {
  const session = await requireRole(['core', 'admin'])
  const isAdmin = session.user.role === 'admin'

  const posts = await prisma.post.findMany({
    include: {
      tags:   true,
      author: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Blog Posts</h1>
        <Link href="/core/blog/new"
          style={{ background: '#4285F4', color: '#fff', padding: '10px 20px',
            borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
          + New Post
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse',
        fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e0e0e0', textAlign: 'left' }}>
            <th style={{ padding: '10px 8px' }}>Title</th>
            <th style={{ padding: '10px 8px' }}>Author</th>
            <th style={{ padding: '10px 8px' }}>Tags</th>
            <th style={{ padding: '10px 8px' }}>Status</th>
            <th style={{ padding: '10px 8px' }}>Date</th>
            <th style={{ padding: '10px 8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}
              style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '12px 8px', fontWeight: 500 }}>
                {post.title}
              </td>
              <td style={{ padding: '12px 8px', color: '#5F6368' }}>
                {post.author.name}
              </td>
              <td style={{ padding: '12px 8px' }}>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {post.tags.map(t => (
                    <span key={t.id} style={{ background: '#E8F0FE', color: '#185FA5',
                      padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem',
                      fontWeight: 700 }}>
                      {t.tag}
                    </span>
                  ))}
                </div>
              </td>
              <td style={{ padding: '12px 8px' }}>
                <span style={{
                  background: post.isPublished ? '#E6F4EA' : '#FEF7E0',
                  color:      post.isPublished ? '#137333' : '#B45309',
                  padding: '2px 8px', borderRadius: 4,
                  fontSize: '0.75rem', fontWeight: 700,
                }}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
              </td>
              <td style={{ padding: '12px 8px', color: '#5F6368' }}>
                {new Date(post.createdAt).toLocaleDateString('en-PK', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </td>
              <td style={{ padding: '12px 8px' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Link href={`/core/blog/${post.id}/edit`}
                    style={{ color: '#4285F4', textDecoration: 'none',
                      fontSize: '0.85rem' }}>
                    Edit
                  </Link>
                  <PostPublishToggle
                    id={post.id}
                    isPublished={post.isPublished}
                  />
                  {isAdmin && <PostDeleteButton id={post.id} />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
