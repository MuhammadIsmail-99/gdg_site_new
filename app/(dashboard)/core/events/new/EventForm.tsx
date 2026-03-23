'use client'

import { createEvent, updateEvent } from '@/app/actions/events'
import { useRouter } from 'next/navigation'
import { useState, useActionState, useEffect } from 'react'
import { Plus, Trash2, Calendar, MapPin, Tag, Type, FileText, Image as ImageIcon, CheckCircle } from 'lucide-react'

type AgendaItem = {
  time: string
  title: string
  description: string
  speaker: string
}

type EventFormProps = {
  event?: any
  mode?: 'create' | 'edit'
}

export default function EventForm({ event, mode = 'create' }: EventFormProps) {
  const router = useRouter()
  
  // State for dynamic fields
  const [tags, setTags] = useState<string>(event?.tags?.map((t: any) => t.tag).join(', ') || '')
  const [agenda, setAgenda] = useState<AgendaItem[]>(event?.agendaItems || [])
  const [isPublished, setIsPublished] = useState<boolean>(event?.isPublished || false)

  const boundAction = mode === 'edit' 
    ? updateEvent.bind(null, event.id) 
    : createEvent

  const [state, action, isPending] = useActionState(boundAction, undefined)

  function addAgendaItem() {
    setAgenda([...agenda, { time: '', title: '', description: '', speaker: '' }])
  }

  function removeAgendaItem(index: number) {
    setAgenda(agenda.filter((_, i) => i !== index))
  }

  function updateAgendaItem(index: number, field: keyof AgendaItem, value: string) {
    const newAgenda = [...agenda]
    newAgenda[index][field] = value
    setAgenda(newAgenda)
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Form Header */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: 16, border: '1px solid #dadce0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            {mode === 'edit' ? <Type size={20} color="#4285F4" /> : <Plus size={20} color="#4285F4" />}
            {mode === 'edit' ? 'Edit Event' : 'Create New Event'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#5f6368' }}>TITLE *</label>
              <input 
                name="title" 
                defaultValue={event?.title}
                required 
                placeholder="Event Title"
                style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#5f6368' }}>DESCRIPTION *</label>
              <textarea 
                name="description" 
                defaultValue={event?.description}
                required 
                rows={5}
                placeholder="Event details..."
                style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Type */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#5f6368' }}>TYPE *</label>
                <select 
                  name="type" 
                  defaultValue={event?.type || 'WORKSHOP'}
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none', background: '#fff' }}
                >
                  <option value="WORKSHOP">Workshop</option>
                  <option value="TALK">Talk</option>
                  <option value="STUDY_GROUP">Study Group</option>
                  <option value="HACKATHON">Hackathon</option>
                  <option value="SOCIAL">Social</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#5f6368' }}>LOCATION *</label>
                <input 
                  name="location" 
                  defaultValue={event?.location}
                  required 
                  placeholder="e.g. Video Conf. Hall"
                  style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Date */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#5f6368' }}>DATE & TIME *</label>
                <input 
                  type="datetime-local"
                  name="date" 
                  defaultValue={event?.date ? new Date(event.date).toISOString().slice(0, 16) : ''}
                  required 
                  style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
                />
              </div>

              {/* Type fallback or other field if needed, but for now just grid balance */}
              <div></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Image URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#5f6368' }}>IMAGE URL</label>
                <input 
                  name="imageUrl" 
                  defaultValue={event?.imageUrl}
                  placeholder="https://images.unsplash.com/..."
                  style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
                />
              </div>

              {/* Badge URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#5f6368' }}>BADGE URL</label>
                <input 
                  name="badgeUrl" 
                  defaultValue={event?.badgeUrl}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: '#5f6368' }}>TAGS (comma-separated)</label>
              <input 
                name="tags" 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="AI, Web, Google Cloud..."
                style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #dadce0', outline: 'none' }}
              />
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {tags.split(',').map(t => t.trim()).filter(Boolean).map((t, idx) => (
                  <span key={idx} style={{ background: '#E8F0FE', color: '#185FA5', padding: '4px 10px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600 }}>
                    {t}
                  </span>
                ))}
              </div>
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

        {/* Agenda Builder */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: 16, border: '1px solid #dadce0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Calendar size={20} color="#34A853" /> Event Agenda
            </h2>
            <button 
              type="button" 
              onClick={addAgendaItem}
              style={{ background: '#f8f9fa', border: '1px solid #dadce0', borderRadius: 8, padding: '6px 14px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >
              + Add Item
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {agenda.map((item, idx) => (
              <div key={idx} style={{ border: '1px solid #f1f3f4', padding: '1.25rem', borderRadius: 12, position: 'relative', background: '#fafafa' }}>
                <button 
                  type="button" 
                  onClick={() => removeAgendaItem(idx)}
                  style={{ position: 'absolute', top: 12, right: 12, color: '#EA4335', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Trash2 size={18} />
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input 
                    placeholder="Time (e.g. 10:00 AM)" 
                    value={item.time} 
                    onChange={(e) => updateAgendaItem(idx, 'time', e.target.value)}
                    style={{ padding: '8px', borderRadius: 6, border: '1px solid #dadce0' }}
                  />
                  <input 
                    placeholder="Topic Title" 
                    value={item.title} 
                    onChange={(e) => updateAgendaItem(idx, 'title', e.target.value)}
                    style={{ padding: '8px', borderRadius: 6, border: '1px solid #dadce0' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input 
                    placeholder="Speaker (optional)" 
                    value={item.speaker} 
                    onChange={(e) => updateAgendaItem(idx, 'speaker', e.target.value)}
                    style={{ padding: '8px', borderRadius: 6, border: '1px solid #dadce0' }}
                  />
                  <input 
                    placeholder="Description (optional)" 
                    value={item.description} 
                    onChange={(e) => updateAgendaItem(idx, 'description', e.target.value)}
                    style={{ padding: '8px', borderRadius: 6, border: '1px solid #dadce0' }}
                  />
                </div>
              </div>
            ))}
            {agenda.length === 0 && (
              <p style={{ textAlign: 'center', color: '#5f6368', fontSize: '0.85rem', padding: '1rem', border: '1px dashed #dadce0', borderRadius: 12 }}>
                No agenda items added yet.
              </p>
            )}
          </div>
          <input type="hidden" name="agenda" value={JSON.stringify(agenda)} />
        </div>

        {/* Error Message */}
        {state && typeof state === 'string' && (
          <div style={{ background: '#FEEBE9', color: '#EA4335', padding: '1rem', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600 }}>
            {state}
          </div>
        )}

        {/* Submit Actions */}
        <div style={{ display: 'flex', gap: 12, marginBottom: '4rem' }}>
          <button 
            type="submit" 
            disabled={isPending}
            style={{ 
              background: '#4285F4', color: '#fff', padding: '12px 32px', borderRadius: 12, border: 'none', fontSize: '1rem', fontWeight: 700, cursor: isPending ? 'wait' : 'pointer', flex: 1,
              boxShadow: '0 4px 12px rgba(66, 133, 244, 0.4)', opacity: isPending ? 0.7 : 1
            }}
          >
            {isPending ? 'Saving...' : mode === 'edit' ? 'Update Event' : 'Create Event'}
          </button>
          <button 
            type="button" 
            onClick={() => router.push('/core/events')}
            style={{ background: '#fff', color: '#5f6368', padding: '12px 24px', borderRadius: 12, border: '1px solid #dadce0', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
