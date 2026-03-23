'use client'

import { createPost, updatePost } from '@/app/actions/posts'
import { useRouter }           from 'next/navigation'
import { useState, useActionState, useEffect, useRef } from 'react'
import { Layout, Send, Image as ImageIcon, Tag, Type, Trash2, Eye, Edit3, CheckCircle } from 'lucide-react'

// Dynamically load marked on client
async function renderMarkdown(text: string): Promise<string> {
  const { marked } = await import('marked')
  return marked.parse(text) as string
}

type PostFormProps = {
  post?: any
  mode?: 'create' | 'edit'
}

export default function PostForm({ post, mode = 'create' }: PostFormProps) {
  const router = useRouter()
  
  // State for tags (managed as array for internal logic, then joined for hidden input or just handled manually)
  const [tags, setTags] = useState<string[]>(post?.tags?.map((t: any) => t.tag) || [])
  const [tagInput, setTagInput] = useState('')
  const [isPublished, setIsPublished] = useState<boolean>(post?.isPublished || false)
  
  // UI state
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [previewHtml, setPreviewHtml] = useState('')
  const [body, setBody] = useState(post?.body || '')

  const boundAction = mode === 'edit' 
    ? updatePost.bind(null, post.id) 
    : createPost

  const [error, action, isPending] = useActionState(boundAction, undefined)

  const tagInputRef = useRef<HTMLInputElement>(null)

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
  }

  async function togglePreview() {
    if (tab === 'write') {
      const html = await renderMarkdown(body || '*Nothing to preview yet…*')
      setPreviewHtml(html)
      setTab('preview')
    } else {
      setTab('write')
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div style={{ background: '#fff', padding: '2rem', borderRadius: 16, border: '1px solid #dadce0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            {mode === 'edit' ? <Edit3 size={20} color="#4285F4" /> : <Send size={20} color="#4285F4" />}
            {mode === 'edit' ? 'Edit Blog Post' : 'Create New Post'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#5f6368' }}>TITLE *</label>
              <input 
                name="title" 
                defaultValue={post?.title}
                required 
                placeholder="Post Title"
                style={{ width: '100%', padding: '14px', borderRadius: 10, border: '1.5px solid #e0e0e0', outline: 'none', fontSize: '1.1rem', fontWeight: 600 }}
              />
            </div>

            {/* Excerpt */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#5f6368' }}>EXCERPT (brief summary)</label>
              <textarea 
                name="excerpt" 
                defaultValue={post?.excerpt}
                rows={2}
                placeholder="A short summary of your post..."
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid #e0e0e0', outline: 'none', resize: 'vertical' }}
              />
            </div>

            {/* Cover Image */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#5f6368' }}>COVER IMAGE URL</label>
              <input 
                name="coverImage" 
                defaultValue={post?.coverImage}
                placeholder="https://images.unsplash.com/..."
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid #e0e0e0', outline: 'none' }}
              />
            </div>

            {/* Tags */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#5f6368' }}>TAGS (up to 5)</label>
              <div 
                onClick={() => tagInputRef.current?.focus()}
                style={{ 
                  display: 'flex', flexWrap: 'wrap', gap: 6, padding: '10px 12px', minHeight: 48,
                  border: '1.5px solid #e0e0e0', borderRadius: 10, background: '#fafafa', cursor: 'text' 
                }}
              >
                {tags.map((tag) => (
                  <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#E8F0FE', color: '#185FA5', padding: '4px 12px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600 }}>
                    {tag}
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeTag(tag) }} style={{ border: 'none', background: 'none', color: '#185FA5', cursor: 'pointer', fontSize: '1rem', padding: 0 }}>×</button>
                  </span>
                ))}
                {tags.length < 5 && (
                  <input 
                    ref={tagInputRef}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
                    style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, minWidth: 100 }}
                  />
                )}
              </div>
              <input type="hidden" name="tags" value={tags.join(', ')} />
            </div>

            {/* Body */}
            <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#5f6368' }}>BODY (Markdown) *</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button 
                    type="button" 
                    onClick={() => setTab('write')}
                    style={{ padding: '4px 12px', borderRadius: '4px 0 0 4px', border: '1px solid #dadce0', background: tab === 'write' ? '#e8f0fe' : '#fff', color: tab === 'write' ? '#1a73e8' : '#5f6368', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Write
                  </button>
                  <button 
                    type="button" 
                    onClick={togglePreview}
                    style={{ padding: '4px 12px', borderRadius: '0 4px 4px 0', border: '1px solid #dadce0', background: tab === 'preview' ? '#e8f0fe' : '#fff', color: tab === 'preview' ? '#1a73e8' : '#5f6368', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', borderLeft: 'none' }}
                  >
                    Preview
                  </button>
                </div>
              </div>
              
              {tab === 'write' ? (
                <textarea 
                  name="body" 
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required 
                  minLength={50}
                  rows={15}
                  placeholder="Write your story here..."
                  style={{ width: '100%', padding: '16px', borderRadius: 10, border: '1.5px solid #e0e0e0', outline: 'none', fontFamily: 'monospace', fontSize: '0.95rem', background: '#fafafa' }}
                />
              ) : (
                <div 
                  className="post-body" 
                  style={{ minHeight: 337, padding: '16px', border: '1.5px solid #e0e0e0', borderRadius: 10, background: '#fff', overflowY: 'auto' }}
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              )}
            </div>

            {/* Publish Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
              <input 
                type="checkbox" 
                id="isPublished" 
                name="isPublished" 
                value="true" 
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
              <label htmlFor="isPublished" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                Publish immediately
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: '#FEEBE9', color: '#EA4335', padding: '1rem', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {/* Submit Actions */}
        <div style={{ display: 'flex', gap: 12, marginBottom: '4rem' }}>
          <button 
            type="submit" 
            disabled={isPending}
            style={{ 
              background: '#4285F4', color: '#fff', padding: '14px 40px', borderRadius: 12, border: 'none', fontSize: '1rem', fontWeight: 700, cursor: isPending ? 'wait' : 'pointer', flex: 1,
              boxShadow: '0 4px 12px rgba(66, 133, 244, 0.4)', opacity: isPending ? 0.7 : 1
            }}
          >
            {isPending ? 'Processing...' : mode === 'edit' ? 'Update Post' : 'Save Post'}
          </button>
          <button 
            type="button" 
            onClick={() => router.push('/core/blog')}
            style={{ background: '#fff', color: '#5f6368', padding: '14px 24px', borderRadius: 12, border: '1px solid #dadce0', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
