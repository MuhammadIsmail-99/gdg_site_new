import React, { Suspense } from 'react'
import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { PostSummary } from '@/types/post'
import styles from './Blog.module.css'
import { BlogTagFilter } from './BlogTagFilter'

// ─── Data Fetchers ────────────────────────────────────────────────────────────

async function getPosts(params?: {
  search?: string
  tag?: string
  page?: number
}): Promise<{ posts: PostSummary[]; total: number; pages: number; page: number }> {
  const search = params?.search ?? ''
  const tag = params?.tag ?? ''
  const page = Math.max(1, params?.page ?? 1)
  const limit = 6
  const skip = (page - 1) * limit

  const where = {
    isPublished: true,
    ...(tag && { tags: { some: { tag: { equals: tag, mode: 'insensitive' as const } } } }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { content: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  }

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { name: true, imageUrl: true } },
          tags: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return {
      posts: posts as unknown as PostSummary[],
      total,
      page,
      pages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.warn('⚠️ Could not fetch posts during build.');
    return { posts: [], total: 0, pages: 1, page: 1 };
  }
}

async function getTags(): Promise<string[]> {
  try {
    const tags = await prisma.postTag.findMany({
      select: { tag: true },
      distinct: ['tag'],
      orderBy: { tag: 'asc' },
    })
    return tags.map(t => t.tag);
  } catch (error) {
    return [];
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; tag?: string; page?: string }>
}) {
  const sp = await searchParams
  const currentPage = sp.page ? Number(sp.page) : 1

  const [data, tags, session] = await Promise.all([
    getPosts({ search: sp.search, tag: sp.tag, page: currentPage }),
    getTags(),
    auth(),
  ])

  const { posts, total, pages } = data

  return (
    <div className="blog-root">
      <style>{`
        .blog-root { font-family: 'Google Sans', 'Roboto', sans-serif; min-height: 100vh; background: #fff; }

        .hero {
          background: white;
          border-bottom: 1px solid #eee;
          padding: 8rem 1.5rem 5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.06;
          pointer-events: none;
          background-image: radial-gradient(#000 1px, transparent 1px);
          background-size: 30px 30px;
        }

        .logo-boxes {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }

        .box { width: 28px; height: 28px; border-radius: 6px; }
        .box-red    { background: #EA4335; transform: rotate(45deg);  opacity: 0.9; }
        .box-blue   { background: #4285F4; transform: rotate(-12deg); border-radius: 8px; opacity: 0.9; }
        .box-yellow { background: #FBBC05; transform: rotate(12deg);  border-radius: 8px; opacity: 0.9; }

        .hero-title {
          font-size: 5rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          color: #1a1a1a;
          letter-spacing: -0.04em;
          position: relative;
          z-index: 1;
        }

        .highlight-blue { color: #4285F4; }

        .hero-sub {
          font-size: 1.125rem;
          color: #5f6368;
          max-width: 600px;
          margin: 0 auto 1.5rem;
          font-weight: 400;
          font-style: italic;
          opacity: 0.8;
          position: relative;
          z-index: 1;
        }

        .hero-stats {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f1f3f4;
          border-radius: 100px;
          padding: 6px 18px;
          font-size: 0.85rem;
          color: #5f6368;
          font-style: normal;
          position: relative;
          z-index: 1;
        }

        .hero-stats strong { color: #4285F4; font-weight: 700; }

        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 2rem;
          position: relative;
          z-index: 1;
          flex-wrap: wrap;
        }

        .write-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #4285F4;
          color: #fff;
          padding: 10px 24px;
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(66,133,244,0.3);
        }

        .write-btn:hover { background: #3367d6; transform: translateY(-1px); opacity: 1; }

        .search-form {
          display: flex;
          gap: 10px;
          max-width: 500px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .search-input {
          flex: 1;
          padding: 10px 18px;
          border: 1.5px solid #e0e0e0;
          border-radius: 100px;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .search-input:focus { border-color: #4285F4; }

        .search-btn {
          background: #4285F4;
          color: #fff;
          border: none;
          border-radius: 100px;
          padding: 10px 20px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .search-btn:hover { background: #3367d6; opacity: 1; }

        .empty-state {
          text-align: center;
          padding: 5rem 1rem;
          color: #5f6368;
        }
        .empty-state h3 { font-size: 1.5rem; margin-bottom: 0.75rem; color: #202124; }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 3rem;
        }

        .page-btn {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 1.5px solid #e0e0e0;
          background: #fff;
          color: #202124;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          transition: all 0.18s;
        }
        .page-btn:hover { border-color: #4285F4; color: #4285F4; opacity: 1; }
        .page-btn.active { background: #4285F4; border-color: #4285F4; color: #fff; }
        .page-btn.disabled { opacity: 0.4; pointer-events: none; }

        .post-tag-pill {
          display: inline-block;
          background: #E8F0FE;
          color: #185FA5;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-right: 4px;
          margin-bottom: 6px;
        }

        .cover-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 8px 8px 0 0;
          margin: -32px -32px 20px;
          width: calc(100% + 64px);
          display: block;
        }

        .author-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 6px;
          vertical-align: middle;
        }
        .author-initials {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: #E8F0FE;
          color: #185FA5;
          font-size: 0.72rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 6px;
          vertical-align: middle;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 3rem; }
          .hero { padding: 4rem 1.5rem 3rem; }
        }
      `}</style>

      {/* ── Hero ── */}
      <header className="hero" data-aos="fade-up">
        <div className="logo-boxes">
          <div className="box box-red" />
          <div className="box box-blue" />
          <div className="box box-yellow" />
        </div>
        <h1 className="hero-title">
          Stories from the <span className="highlight-blue">Chapter</span>
        </h1>
        <p className="hero-sub">
          &ldquo;Technical articles, event recaps, and student project showcases.&rdquo;
        </p>
        <div className="hero-stats">
          <strong>{total}</strong> {total === 1 ? 'post' : 'posts'} published
        </div>

        {/* Search */}
        <form className="search-form" style={{ marginTop: '2rem' }} method="GET" action="/blog">
          {sp.tag && <input type="hidden" name="tag" value={sp.tag} />}
          <input
            className="search-input"
            type="text"
            name="search"
            placeholder="Search articles…"
            defaultValue={sp.search ?? ''}
          />
          <button className="search-btn" type="submit">Search</button>
        </form>

        {/* Write a post — only for logged-in users */}
        {session?.user && (
          <div className="hero-actions">
            <Link href="/blog/new" className="write-btn">
              ✍️ Write a post
            </Link>
          </div>
        )}
      </header>

      {/* ── Body ── */}
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }} data-aos="fade-up">

        {/* Tag filter */}
        {tags.length > 0 && (
          <Suspense fallback={null}>
            <BlogTagFilter tags={tags} activeTag={sp.tag ?? ''} />
          </Suspense>
        )}

        {/* Grid */}
        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No posts found</h3>
            <p>
              {sp.search || sp.tag
                ? 'Try adjusting your search or filter.'
                : 'Be the first to write a post!'}
            </p>
          </div>
        ) : (
          <div className={styles.blogGrid}>
            {posts.map((post) => (
              <div key={post.id} className={styles.postCard}>
                {/* Cover image */}
                {post.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="cover-img"
                  />
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    {post.tags.slice(0, 3).map((t) => (
                      <span key={t.id} className="post-tag-pill">{t.tag}</span>
                    ))}
                  </div>
                )}

                <div className={styles.cardHeader}>
                  <span className={styles.date}>
                    {new Date(post.createdAt).toLocaleDateString('en-PK', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h3>{post.title}</h3>
                <p className={styles.excerpt}>
                  {post.excerpt ?? ''}
                </p>

                <div className={styles.footer}>
                  <span className={styles.author}>
                    {post.author.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.author.imageUrl}
                        alt={post.author.name}
                        className="author-avatar"
                      />
                    ) : (
                      <span className="author-initials">
                        {post.author.name.charAt(0)}
                      </span>
                    )}
                    By {post.author.name}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className={styles.readMore}
                    style={{ textDecoration: 'none' }}
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <nav className="pagination" aria-label="Pagination">
            <Link
              href={`/blog?${new URLSearchParams({
                ...(sp.search ? { search: sp.search } : {}),
                ...(sp.tag ? { tag: sp.tag } : {}),
                page: String(Math.max(1, currentPage - 1)),
              }).toString()}`}
              className={`page-btn${currentPage <= 1 ? ' disabled' : ''}`}
              aria-label="Previous page"
            >
              ←
            </Link>

            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/blog?${new URLSearchParams({
                  ...(sp.search ? { search: sp.search } : {}),
                  ...(sp.tag ? { tag: sp.tag } : {}),
                  page: String(p),
                }).toString()}`}
                className={`page-btn${p === currentPage ? ' active' : ''}`}
              >
                {p}
              </Link>
            ))}

            <Link
              href={`/blog?${new URLSearchParams({
                ...(sp.search ? { search: sp.search } : {}),
                ...(sp.tag ? { tag: sp.tag } : {}),
                page: String(Math.min(pages, currentPage + 1)),
              }).toString()}`}
              className={`page-btn${currentPage >= pages ? ' disabled' : ''}`}
              aria-label="Next page"
            >
              →
            </Link>
          </nav>
        )}
      </div>
    </div>
  )
}
