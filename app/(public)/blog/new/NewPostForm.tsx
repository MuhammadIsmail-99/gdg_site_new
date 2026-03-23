'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

// Dynamically load marked on client
async function renderMarkdown(text: string): Promise<string> {
  const { marked } = await import('marked')
  return marked.parse(text) as string
}

export default function NewPostForm() {
  const router = useRouter()

  // Form state
  const [title, setTitle]         = useState('')
  const [excerpt, setExcerpt]     = useState('')
  const [body, setBody]           = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [tagInput, setTagInput]   = useState('')
  const [tags, setTags]           = useState<string[]>([])

  // UI state
  const [previewHtml, setPreviewHtml] = useState('')
  const [tab, setTab]             = useState<'write' | 'preview'>('write')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)

  const tagInputRef = useRef<HTMLInputElement>(null)

  // ── Tag management ──
  function addTag(raw: string) {
    const cleaned = raw.trim().toLowerCase().replace(/,/g, '')
    if (!cleaned || tags.length >= 5 || tags.includes(cleaned)) return
    setTags([...tags, cleaned])
    setTagInput('')
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    }
    if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags(tags.slice(0, -1))
    }
  }

  // ── Preview toggle ──
  async function togglePreview() {
    if (tab === 'write') {
      const html = await renderMarkdown(body || '*Nothing to preview yet…*')
      setPreviewHtml(html)
      setTab('preview')
    } else {
      setTab('write')
    }
  }

  // ── Submit ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt, body, coverImage, tags }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Something went wrong.')
        setSubmitting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/blog'), 1800)
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  // ── Render ──
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "var(--font-primary, 'Inter', sans-serif)" }}>
      <style>{`
        .np-hero {
          background: #fff;
          border-bottom: 1px solid #eee;
          padding: 5rem 1.5rem 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .np-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.06;
          background-image: radial-gradient(#000 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
        }
        .np-hero h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #202124;
          position: relative;
          z-index: 1;
          margin-bottom: 0.5rem;
        }
        .np-hero p {
          color: #5f6368;
          position: relative;
          z-index: 1;
          font-size: 1rem;
        }

        .np-form-wrap {
          max-width: 820px;
          margin: 3rem auto 6rem;
          padding: 0 1.5rem;
        }

        .np-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.07);
          padding: 2.5rem;
          border: 1px solid #f0f0f0;
        }

        .np-field { margin-bottom: 1.75rem; }

        .np-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #5f6368;
          margin-bottom: 8px;
        }

        .np-required { color: #ea4335; margin-left: 2px; }

        .np-input, .np-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: #fafafa;
          color: #202124;
          box-sizing: border-box;
        }
        .np-input:focus, .np-textarea:focus {
          border-color: #4285F4;
          box-shadow: 0 0 0 3px rgba(66,133,244,0.12);
          background: #fff;
        }
        .np-textarea { resize: vertical; min-height: 80px; line-height: 1.6; }

        .np-char-count {
          font-size: 0.78rem;
          color: #5f6368;
          text-align: right;
          margin-top: 5px;
        }
        .np-char-count.warn { color: #ea4335; font-weight: 600; }

        /* Tags */
        .tag-input-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 10px 12px;
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          background: #fafafa;
          cursor: text;
          transition: border-color 0.2s;
        }
        .tag-input-wrap:focus-within {
          border-color: #4285F4;
          box-shadow: 0 0 0 3px rgba(66,133,244,0.12);
          background: #fff;
        }
        .tag-pill-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #E8F0FE;
          color: #185FA5;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .tag-remove {
          background: none;
          border: none;
          cursor: pointer;
          color: #5f6368;
          font-size: 0.9rem;
          padding: 0;
          line-height: 1;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .tag-remove:hover { color: #ea4335; opacity: 1; }
        .tag-bare-input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.9rem;
          flex: 1;
          min-width: 120px;
          color: #202124;
          font-family: inherit;
        }
        .tag-hint { font-size: 0.78rem; color: #5f6368; margin-top: 5px; }

        /* Body editor tabs */
        .tab-row {
          display: flex;
          gap: 0;
          margin-bottom: -1px;
        }
        .tab-btn {
          padding: 8px 20px;
          border: 1.5px solid #e0e0e0;
          background: #f1f3f4;
          color: #5f6368;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          border-bottom: none;
        }
        .tab-btn:first-child { border-radius: 8px 0 0 0; }
        .tab-btn:last-child  { border-radius: 0 8px 0 0; }
        .tab-btn.active {
          background: #fff;
          color: #4285F4;
          border-color: #e0e0e0;
        }
        .tab-btn:hover { opacity: 1; color: #4285F4; }

        .body-textarea {
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          min-height: 300px;
          font-family: var(--font-mono, monospace);
          font-size: 0.9rem;
        }

        .preview-pane {
          border: 1.5px solid #e0e0e0;
          border-top-left-radius: 0;
          border-top-right-radius: 0;
          border-radius: 0 0 10px 10px;
          min-height: 300px;
          padding: 1.5rem;
          background: #fff;
          font-size: 1rem;
          line-height: 1.75;
          color: #202124;
        }

        /* Preview body styles */
        .preview-pane h1, .preview-pane h2, .preview-pane h3 {
          font-weight: 700; margin: 1.5rem 0 0.75rem; letter-spacing: -0.01em;
        }
        .preview-pane p   { margin-bottom: 1rem; }
        .preview-pane code {
          background: #f1f3f4; padding: 2px 6px;
          border-radius: 4px; font-size: 0.87em;
        }
        .preview-pane pre {
          background: #202124; color: #e8eaed;
          padding: 1.25rem; border-radius: 10px;
          overflow-x: auto; margin-bottom: 1.25rem;
        }
        .preview-pane pre code { background: none; }
        .preview-pane blockquote {
          border-left: 4px solid #4285F4;
          padding-left: 1rem; color: #5f6368;
          font-style: italic; margin: 1rem 0;
        }
        .preview-pane a   { color: #4285F4; }
        .preview-pane ul, .preview-pane ol {
          padding-left: 1.5rem; margin-bottom: 1rem;
        }
        .preview-pane li  { margin-bottom: 0.35rem; }

        /* Submit row */
        .np-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-top: 2rem;
          flex-wrap: wrap;
        }
        .np-submit {
          background: #4285F4;
          color: #fff;
          border: none;
          padding: 13px 32px;
          border-radius: 100px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(66,133,244,0.3);
        }
        .np-submit:hover:not(:disabled) { background: #3367d6; transform: translateY(-1px); opacity: 1; }
        .np-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .np-cancel {
          color: #5f6368;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 100px;
          border: 1.5px solid #e0e0e0;
          display: inline-block;
          transition: all 0.18s;
        }
        .np-cancel:hover { border-color: #ea4335; color: #ea4335; opacity: 1; }

        .np-error {
          background: #fce8e6;
          color: #c62828;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 0.9rem;
          margin-top: 1rem;
          border-left: 4px solid #ea4335;
        }

        .np-success {
          background: #e6f4ea;
          color: #1b5e20;
          padding: 16px 20px;
          border-radius: 10px;
          font-size: 0.95rem;
          margin-top: 1rem;
          border-left: 4px solid #34a853;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
        }

        .np-draft-note {
          background: #fef9e7;
          border: 1px solid #f9ab00;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 0.85rem;
          color: #7d5c00;
          margin-bottom: 1.75rem;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
      `}</style>

      {/* Hero */}
      <div className="np-hero">
        <h1>✍️ Write a Post</h1>
        <p>Share your knowledge with the GDGoC CUI Wah community</p>
      </div>

      <div className="np-form-wrap">
        <div className="np-card">
          {/* Draft note */}
          <div className="np-draft-note">
            <span>📋</span>
            <span>
              Your post will be submitted as a <strong>draft</strong> and reviewed
              by a core member before it&apos;s published publicly.
            </span>
          </div>

          {success ? (
            <div className="np-success">
              <span>✅</span>
              Post submitted successfully! Redirecting to blog…
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Title */}
              <div className="np-field">
                <label className="np-label" htmlFor="np-title">
                  Title <span className="np-required">*</span>
                </label>
                <input
                  id="np-title"
                  className="np-input"
                  type="text"
                  placeholder="Give your post a great title…"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={5}
                  maxLength={200}
                />
              </div>

              {/* Excerpt */}
              <div className="np-field">
                <label className="np-label" htmlFor="np-excerpt">
                  Excerpt <span style={{ color: '#5f6368', fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  id="np-excerpt"
                  className="np-textarea np-input"
                  placeholder="A short description shown on the blog listing…"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value.slice(0, 300))}
                  rows={3}
                />
                <p className={`np-char-count${excerpt.length > 270 ? ' warn' : ''}`}>
                  {excerpt.length} / 300
                </p>
              </div>

              {/* Cover image */}
              <div className="np-field">
                <label className="np-label" htmlFor="np-cover">
                  Cover Image URL <span style={{ color: '#5f6368', fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  id="np-cover"
                  className="np-input"
                  type="url"
                  placeholder="https://…"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
              </div>

              {/* Tags */}
              <div className="np-field">
                <label className="np-label" htmlFor="np-tags">
                  Tags{' '}
                  <span style={{ color: '#5f6368', fontWeight: 400 }}>
                    (up to 5)
                  </span>
                </label>
                <div
                  className="tag-input-wrap"
                  onClick={() => tagInputRef.current?.focus()}
                >
                  {tags.map((tag) => (
                    <span key={tag} className="tag-pill-item">
                      {tag}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={(e) => { e.stopPropagation(); removeTag(tag) }}
                        aria-label={`Remove tag ${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {tags.length < 5 && (
                    <input
                      id="np-tags"
                      ref={tagInputRef}
                      className="tag-bare-input"
                      type="text"
                      placeholder={tags.length === 0 ? 'Type a tag and press Enter…' : ''}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      onBlur={() => { if (tagInput.trim()) addTag(tagInput) }}
                    />
                  )}
                </div>
                <p className="tag-hint">Press Enter or comma to add a tag. Max 5 tags.</p>
              </div>

              {/* Body */}
              <div className="np-field">
                <label className="np-label">
                  Body <span className="np-required">*</span>
                </label>
                <div className="tab-row">
                  <button
                    type="button"
                    className={`tab-btn${tab === 'write' ? ' active' : ''}`}
                    onClick={() => setTab('write')}
                  >
                    ✏️ Write
                  </button>
                  <button
                    type="button"
                    className={`tab-btn${tab === 'preview' ? ' active' : ''}`}
                    onClick={togglePreview}
                  >
                    👁 Preview
                  </button>
                </div>

                {tab === 'write' ? (
                  <textarea
                    id="np-body"
                    className="np-textarea np-input body-textarea"
                    placeholder="Write your post in Markdown…&#10;&#10;## Heading&#10;**Bold**, *italic*, `code`…"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    minLength={50}
                    rows={16}
                  />
                ) : (
                  <div
                    className="preview-pane"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                )}
              </div>

              {/* Error */}
              {error && <div className="np-error">⚠ {error}</div>}

              {/* Actions */}
              <div className="np-actions">
                <button
                  type="submit"
                  className="np-submit"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting…' : '🚀 Submit Draft'}
                </button>
                <a href="/blog" className="np-cancel">Cancel</a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
