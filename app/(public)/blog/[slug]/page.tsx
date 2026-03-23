import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { renderBody } from '@/lib/renderBody'
import type { PostDetail } from '@/types/post'
import type { Metadata } from 'next'

// ─── Data Fetcher ─────────────────────────────────────────────────────────────

async function getPost(slug: string): Promise<PostDetail> {
  const res = await fetch(
    `${process.env.AUTH_URL ?? 'http://localhost:3000'}/api/posts/${slug}`,
    { cache: 'no-store' }
  )
  if (!res.ok) notFound()
  return res.json()
}

// ─── Static Params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where:  { isPublished: true },
    select: { slug: true },
  })
  return posts.map((p) => ({ slug: p.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await getPost(slug)
    return {
      title: `${post.title} | GDGoC CUI Wah Blog`,
      description: post.excerpt ?? undefined,
      openGraph: {
        title: post.title,
        description: post.excerpt ?? undefined,
        images: post.coverImage ? [post.coverImage] : [],
      },
    }
  } catch {
    return { title: 'Post Not Found | GDGoC CUI Wah Blog' }
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  const bodyHtml = renderBody(post.body)

  return (
    <article style={{ fontFamily: "var(--font-primary, 'Google Sans', 'Inter', sans-serif)" }}>
      <style>{`
        /* ── Back link ── */
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #5f6368;
          font-size: 0.85rem;
          font-weight: 500;
          text-decoration: none;
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid #f1f3f4;
          width: 100%;
          background: #fff;
          position: sticky;
          top: 64px;
          z-index: 10;
          transition: color 0.15s;
        }
        .back-link:hover { color: #4285F4; opacity: 1; }

        /* ── Cover ── */
        .post-cover {
          width: 100%;
          max-height: 480px;
          object-fit: cover;
          display: block;
        }

        /* ── Header / meta ── */
        .post-header {
          max-width: 760px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 0;
        }

        .tag-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }

        .tag-pill {
          background: #E8F0FE;
          color: #185FA5;
          padding: 4px 14px;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-decoration: none;
          transition: background 0.15s;
        }
        .tag-pill:hover { background: #d0e3ff; opacity: 1; }

        .post-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
          color: #202124;
        }

        .author-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .author-img {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .author-initial {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #E8F0FE;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #185FA5;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .author-name {
          font-weight: 700;
          color: #202124;
          text-decoration: none;
          font-size: 0.95rem;
          display: block;
          transition: color 0.15s;
        }
        .author-name:hover { color: #4285F4; opacity: 1; }

        .author-meta {
          font-size: 0.8rem;
          color: #5f6368;
          margin: 2px 0 0;
        }

        /* ── Body ── */
        .post-body-wrapper {
          max-width: 760px;
          margin: 0 auto;
          padding: 0 1.5rem 5rem;
        }

        .post-body {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #202124;
        }

        .post-body h1, .post-body h2, .post-body h3,
        .post-body h4, .post-body h5, .post-body h6 {
          font-family: var(--font-primary, 'Inter', sans-serif);
          font-weight: 700;
          margin: 2.25rem 0 1rem;
          letter-spacing: -0.02em;
          line-height: 1.25;
          color: #1a1a1a;
        }
        .post-body h1 { font-size: 2rem; }
        .post-body h2 { font-size: 1.6rem; }
        .post-body h3 { font-size: 1.3rem; }
        .post-body p  { margin-bottom: 1.5rem; }
        .post-body a  { color: #4285F4; text-decoration: underline; }
        .post-body a:hover { opacity: 0.85; }
        .post-body code {
          background: #f1f3f4;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 0.88em;
          font-family: var(--font-mono, monospace);
        }
        .post-body pre {
          background: #202124;
          color: #e8eaed;
          padding: 1.5rem;
          border-radius: 12px;
          overflow-x: auto;
          margin-bottom: 1.75rem;
          font-size: 0.92rem;
          line-height: 1.6;
        }
        .post-body pre code {
          background: none;
          padding: 0;
          font-size: inherit;
          color: inherit;
        }
        .post-body blockquote {
          border-left: 4px solid #4285F4;
          padding: 0.75rem 1.25rem;
          color: #5f6368;
          font-style: italic;
          margin: 1.75rem 0;
          background: #f8f9fa;
          border-radius: 0 8px 8px 0;
        }
        .post-body img {
          max-width: 100%;
          border-radius: 10px;
          margin: 1.75rem 0;
          display: block;
        }
        .post-body ul, .post-body ol {
          padding-left: 1.75rem;
          margin-bottom: 1.5rem;
        }
        .post-body li { margin-bottom: 0.5rem; }
        .post-body hr {
          border: none;
          border-top: 1px solid #f0f0f0;
          margin: 2.5rem 0;
        }
        .post-body table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.75rem;
          font-size: 0.9rem;
        }
        .post-body th, .post-body td {
          border: 1px solid #e0e0e0;
          padding: 10px 14px;
          text-align: left;
        }
        .post-body th { background: #f1f3f4; font-weight: 700; }

        /* ── Bio card ── */
        .bio-card {
          max-width: 760px;
          margin: 0 auto 5rem;
          padding: 0 1.5rem;
        }
        .bio-card-inner {
          background: #f8f9fa;
          border-radius: 16px;
          border-left: 4px solid #4285F4;
          padding: 1.75rem;
          display: flex;
          gap: 18px;
          align-items: flex-start;
        }
        .bio-author-img {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .bio-author-initial {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #E8F0FE;
          color: #185FA5;
          font-size: 1.3rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .bio-author-name {
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 6px;
          color: #202124;
        }
        .bio-text {
          color: #5f6368;
          font-size: 0.9rem;
          line-height: 1.65;
          margin-bottom: 10px;
        }
        .bio-profile-link {
          color: #4285F4;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
        }
        .bio-profile-link:hover { opacity: 0.8; }

        .social-links {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }
        .social-link {
          color: #5f6368;
          font-size: 0.82rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: #fff;
          border-radius: 100px;
          border: 1px solid #e0e0e0;
          transition: all 0.18s;
        }
        .social-link:hover { border-color: #4285F4; color: #4285F4; opacity: 1; }

        @media (max-width: 600px) {
          .bio-card-inner { flex-direction: column; }
          .post-header { padding: 1.5rem 1rem 0; }
          .post-body-wrapper { padding: 0 1rem 4rem; }
        }
      `}</style>

      {/* ── Back link ── */}
      <Link href="/blog" className="back-link">
        ← Back to Blog
      </Link>

      {/* ── Cover image ── */}
      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.title}
          className="post-cover"
        />
      )}

      {/* ── Header ── */}
      <header className="post-header">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="tag-row">
            {post.tags.map((t) => (
              <Link
                key={t.id}
                href={`/blog?tag=${encodeURIComponent(t.tag)}`}
                className="tag-pill"
              >
                {t.tag}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="post-title">{post.title}</h1>

        {/* Author row */}
        <div className="author-row">
          {post.author.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.author.imageUrl}
              alt={post.author.name}
              className="author-img"
            />
          ) : (
            <div className="author-initial">
              {post.author.name.charAt(0)}
            </div>
          )}
          <div>
            <Link href={`/team/${post.author.slug}`} className="author-name">
              {post.author.name}
            </Link>
            <p className="author-meta">
              {post.author.tier ?? post.author.role}
              {' · '}
              {new Date(post.createdAt).toLocaleDateString('en-PK', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="post-body-wrapper">
        <div
          className="post-body"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </div>

      {/* ── Author bio card ── */}
      {post.author.bio && (
        <div className="bio-card">
          <div className="bio-card-inner">
            {post.author.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.author.imageUrl}
                alt={post.author.name}
                className="bio-author-img"
              />
            ) : (
              <div className="bio-author-initial">
                {post.author.name.charAt(0)}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <p className="bio-author-name">About {post.author.name}</p>
              <p className="bio-text">{post.author.bio}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <Link href={`/team/${post.author.slug}`} className="bio-profile-link">
                  View full profile →
                </Link>
                {(post.author.linkedin || post.author.github) && (
                  <div className="social-links">
                    {post.author.linkedin && (
                      <a
                        href={post.author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        in LinkedIn
                      </a>
                    )}
                    {post.author.github && (
                      <a
                        href={post.author.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        ⌥ GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
