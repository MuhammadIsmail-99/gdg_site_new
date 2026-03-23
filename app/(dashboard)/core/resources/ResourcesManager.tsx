'use client'

import React, { useState, useTransition } from 'react'
import {
  createTrack, updateTrack, deleteTrack,
  addTrackStep, deleteTrackStep,
  createPlatform, updatePlatform, deletePlatform,
  addTool, deleteTool
} from '@/app/actions/core/resources'
import {
  Layout, Globe, Wrench, Plus, Trash2, Pencil, ChevronDown, ChevronUp, ExternalLink, MoveUp, MoveDown
} from 'lucide-react'
import type { ResourceTrack, ResourcePlatform, ResourceToolCategory } from '@/types/resources'

type Tab = 'tracks' | 'platforms' | 'tools'

export default function ResourcesManager({
  tracks,
  platforms,
  toolCategories
}: {
  tracks: ResourceTrack[]
  platforms: ResourcePlatform[]
  toolCategories: ResourceToolCategory[]
}) {
  const [active, setActive] = useState<Tab>('tracks')

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'tracks',    label: 'Tracks',    icon: Layout },
    { key: 'platforms', label: 'Platforms', icon: Globe  },
    { key: 'tools',     label: 'Tools',     icon: Wrench  },
  ]

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid #e0e0e0',
        marginBottom: 40, paddingBottom: 0 }}>
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              style={{
                padding:        '12px 24px',
                background:     'none',
                border:         'none',
                borderBottom:   active === tab.key
                                  ? '3px solid #4285F4'
                                  : '3px solid transparent',
                cursor:         'pointer',
                fontWeight:     700,
                color:          active === tab.key ? '#4285F4' : '#5F6368',
                fontSize:       '1rem',
                transition:     'color 0.2s',
                marginBottom:   -1,
                display:        'flex',
                alignItems:     'center',
                gap:            8
              }}
            >
              <Icon size={18} /> {tab.label}
            </button>
          )
        })}
      </div>

      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
        {active === 'tracks'    && <TracksTab tracks={tracks} />}
        {active === 'platforms' && <PlatformsTab platforms={platforms} />}
        {active === 'tools'     && <ToolsTab toolCategories={toolCategories} />}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  )
}

// --- TAB 1: TRACKS ---

function TracksTab({ tracks }: { tracks: ResourceTrack[] }) {
  const [editing, setEditing] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Learning Tracks</h2>
        <button
          onClick={() => setShowAdd(true)}
          style={{ background: '#4285F4', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Plus size={18} /> Add Track
        </button>
      </div>

      {showAdd && (
        <TrackForm mode="create" onCancel={() => setShowAdd(false)} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {tracks.map(track => (
          <div key={track.id} style={{ border: '1px solid #e0e0e0', borderRadius: 12, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            {editing === track.id ? (
              <TrackForm mode="edit" track={track} onCancel={() => setEditing(null)} />
            ) : (
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: 4, background: track.tagColor + '20', color: track.tagColor, textTransform: 'uppercase' }}>
                        {track.tag}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{track.name}</h3>
                      <span style={{ fontSize: '0.8rem', color: '#5F6368', background: '#f1f3f4', padding: '2px 8px', borderRadius: 100 }}>
                        {track.steps.length} Steps
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#5F6368', fontSize: '0.95rem', lineHeight: 1.5 }}>{track.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setEditing(track.id)} title="Edit Track" style={{ padding: 10, borderRadius: 10, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', color: '#4285F4' }}>
                      <Pencil size={20} />
                    </button>
                    <DeleteConfirmButton onConfirm={() => deleteTrack(track.id)} />
                  </div>
                </div>

                <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: 12, border: '1px solid #f0f0f0' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#5F6368', letterSpacing: '0.05em', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Layout size={14} /> Journey Steps
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {track.steps.length === 0 ? (
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#9aa0a6', fontStyle: 'italic' }}>No steps added to this track yet.</p>
                    ) : (
                      track.steps.map(step => (
                        <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '12px 16px', borderRadius: 10, border: '1px solid #eee' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#4285F4', minWidth: 32, textAlign: 'center' }}>{step.stepNum}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#202124' }}>{step.title}</div>
                            <div style={{ fontSize: '0.85rem', color: '#5F6368', marginTop: 2 }}>{step.description}</div>
                          </div>
                          <DeleteConfirmButton mini onConfirm={() => deleteTrackStep(step.id)} />
                        </div>
                      ))
                    )}
                    <div style={{ marginTop: 8 }}>
                      <AddStepForm trackId={track.id} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function TrackForm({ mode, track, onCancel }: { mode: 'create' | 'edit', track?: ResourceTrack, onCancel: () => void }) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const action = mode === 'create' ? createTrack : updateTrack.bind(null, track!.id)

  return (
    <form action={async (formData) => {
      setError(null)
      startTransition(async () => {
        const result = await action(undefined, formData)
        if (!result) onCancel()
        else setError(result)
      })
    }} style={{ padding: 24, background: '#fff' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: 700 }}>{mode === 'create' ? 'Add New Track' : 'Edit Track'}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6368', marginBottom: 6 }}>NAME</label>
          <input name="name" defaultValue={track?.name} required style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #dadce0' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6368', marginBottom: 6 }}>TAG</label>
          <input name="tag" defaultValue={track?.tag} placeholder="WEB, AI..." required style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #dadce0' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6368', marginBottom: 6 }}>TAG COLOR (HEX)</label>
          <input name="tagColor" defaultValue={track?.tagColor || '#4285F4'} placeholder="#4285F4" required pattern="^#[0-9A-Fa-f]{6}$" style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #dadce0' }} />
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6368', marginBottom: 6 }}>DESCRIPTION</label>
        <textarea name="description" defaultValue={track?.description} required rows={3} style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #dadce0', resize: 'none' }} />
      </div>
      {error && <p style={{ color: '#EA4335', fontSize: '0.85rem', marginBottom: 16 }}>{error}</p>}
      <div style={{ display: 'flex', gap: 12, marginBottom: mode === 'edit' ? 32 : 0 }}>
        <button type="submit" disabled={isPending} style={{ background: '#4285F4', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', opacity: isPending ? 0.7 : 1 }}>
          {isPending ? 'Saving...' : mode === 'create' ? 'Create Track' : 'Save Changes'}
        </button>
        <button type="button" onClick={onCancel} style={{ background: '#fff', border: '1px solid #dadce0', padding: '10px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
          Cancel
        </button>
      </div>

      {mode === 'edit' && track && (
        <div style={{ marginTop: 32, padding: '20px', background: '#f8f9fa', borderRadius: 12, border: '1px solid #e0e0e0' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#5F6368', letterSpacing: '0.05em', margin: '0 0 16px 0' }}>Manage Steps</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {track.steps.map(step => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '10px 14px', borderRadius: 8, border: '1px solid #eee' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4285F4', minWidth: 24 }}>{step.stepNum}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{step.title}</div>
                </div>
                <DeleteConfirmButton mini onConfirm={() => deleteTrackStep(step.id)} />
              </div>
            ))}
            <div style={{ marginTop: 8 }}>
              <AddStepForm trackId={track.id} />
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

function AddStepForm({ trackId }: { trackId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [show, setShow] = useState(false)

  if (!show) {
    return (
      <button onClick={() => setShow(true)} style={{ padding: '8px 12px', background: 'none', border: '1px dashed #dadce0', borderRadius: 8, color: '#4285F4', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Plus size={16} /> Add Step
      </button>
    )
  }

  return (
    <form action={async (formData) => {
      setError(null)
      startTransition(async () => {
        const result = await addTrackStep(trackId, undefined, formData)
        if (!result) setShow(false)
        else setError(result)
      })
    }} style={{ padding: 16, background: '#fff', border: '1px solid #4285F4', borderRadius: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 60px', gap: 12, marginBottom: 12 }}>
        <input name="stepNum" placeholder="01 / ..." required style={{ padding: '8px', borderRadius: 4, border: '1px solid #dadce0', fontSize: '0.85rem' }} />
        <input name="title" placeholder="Step Title" required style={{ padding: '8px', borderRadius: 4, border: '1px solid #dadce0', fontSize: '0.85rem' }} />
        <input name="order" type="number" defaultValue="0" required style={{ padding: '8px', borderRadius: 4, border: '1px solid #dadce0', fontSize: '0.85rem' }} />
      </div>
      <textarea name="description" placeholder="Description" required style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #dadce0', fontSize: '0.85rem', marginBottom: 12, resize: 'none' }} />
      {error && <p style={{ color: '#EA4335', fontSize: '0.8rem', marginBottom: 12 }}>{error}</p>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={isPending} style={{ background: '#4285F4', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 6, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
          {isPending ? 'Adding...' : 'Add'}
        </button>
        <button type="button" onClick={() => setShow(false)} style={{ background: '#fff', border: '1px solid #dadce0', padding: '6px 16px', borderRadius: 6, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

// --- TAB 2: PLATFORMS ---

function PlatformsTab({ platforms }: { platforms: ResourcePlatform[] }) {
  const [editing, setEditing] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div style={{ maxWidth: 800 }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Learning Platforms</h2>
        <button
          onClick={() => setShowAdd(true)}
          style={{ background: '#4285F4', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Plus size={18} /> Add Platform
        </button>
      </div>

      {showAdd && (
        <PlatformForm mode="create" onCancel={() => setShowAdd(false)} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {platforms.map(platform => (
          <div key={platform.id}>
            {editing === platform.id ? (
              <PlatformForm mode="edit" platform={platform} onCancel={() => setEditing(null)} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{platform.name}</h3>
                    <a href={platform.url} target="_blank" rel="noopener noreferrer" style={{ color: '#4285F4' }}><ExternalLink size={14} /></a>
                  </div>
                  <p style={{ margin: '4px 0 0', color: '#5F6368', fontSize: '0.9rem' }}>{platform.description}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setEditing(platform.id)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', color: '#5F6368' }}>
                    <Pencil size={18} />
                  </button>
                  <DeleteConfirmButton onConfirm={() => deletePlatform(platform.id)} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function PlatformForm({ mode, platform, onCancel }: { mode: 'create' | 'edit', platform?: ResourcePlatform, onCancel: () => void }) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const action = mode === 'create' ? createPlatform : updatePlatform.bind(null, platform!.id)

  return (
    <form action={async (formData) => {
      setError(null)
      startTransition(async () => {
        const result = await action(undefined, formData)
        if (!result) onCancel()
        else setError(result)
      })
    }} style={{ padding: 24, background: '#fff', border: '2px solid #4285F4', borderRadius: 12, marginBottom: 16 }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: 700 }}>{mode === 'create' ? 'Add New Platform' : 'Edit Platform'}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6368', marginBottom: 6 }}>NAME</label>
          <input name="name" defaultValue={platform?.name} required style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #dadce0' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6368', marginBottom: 6 }}>URL</label>
          <input name="url" defaultValue={platform?.url} required style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #dadce0' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6368', marginBottom: 6 }}>SORT ORDER</label>
          <input name="order" type="number" defaultValue={platform?.order || 0} required style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #dadce0' }} />
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6368', marginBottom: 6 }}>DESCRIPTION</label>
        <textarea name="description" defaultValue={platform?.description} required rows={2} style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #dadce0', resize: 'none' }} />
      </div>
      {error && <p style={{ color: '#EA4335', fontSize: '0.85rem', marginBottom: 16 }}>{error}</p>}
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" disabled={isPending} style={{ background: '#4285F4', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', opacity: isPending ? 0.7 : 1 }}>
          {isPending ? 'Saving...' : mode === 'create' ? 'Create Platform' : 'Save Changes'}
        </button>
        <button type="button" onClick={onCancel} style={{ background: '#fff', border: '1px solid #dadce0', padding: '10px 24px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

// --- TAB 3: TOOLS ---

function ToolsTab({ toolCategories }: { toolCategories: ResourceToolCategory[] }) {
  return (
    <div style={{ maxWidth: 800 }}>
       <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 24 }}>The Toolbox</h2>
       <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
         {toolCategories.map(cat => (
           <div key={cat.id} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 20 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
               <span style={{ width: 10, height: 10, borderRadius: '50%', background: cat.colorHex }} />
               <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{cat.name}</h3>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
               {cat.tools.map(tool => (
                 <div key={tool.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, border: '1px solid #eee' }}>
                   <div style={{ flex: 1 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                       <span style={{ fontWeight: 600 }}>{tool.name}</span>
                       {tool.url && <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{ color: '#4285F4' }}><ExternalLink size={12} /></a>}
                     </div>
                   </div>
                   <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5F6368', background: '#f0f0f0', padding: '2px 8px', borderRadius: 4 }}>{tool.toolType}</span>
                   <DeleteConfirmButton mini onConfirm={() => deleteTool(tool.id)} />
                 </div>
               ))}
               <AddToolForm categoryId={cat.id} />
             </div>
           </div>
         ))}
       </div>
    </div>
  )
}

function AddToolForm({ categoryId }: { categoryId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [show, setShow] = useState(false)

  if (!show) {
    return (
      <button onClick={() => setShow(true)} style={{ padding: '8px 12px', background: 'none', border: '1px dashed #dadce0', borderRadius: 8, color: '#4285F4', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Plus size={16} /> Add Tool
      </button>
    )
  }

  return (
    <form action={async (formData) => {
      setError(null)
      startTransition(async () => {
        const result = await addTool(categoryId, undefined, formData)
        if (!result) setShow(false)
        else setError(result)
      })
    }} style={{ padding: 16, background: '#fff', border: '1px solid #4285F4', borderRadius: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <input name="name" placeholder="Tool Name" required style={{ padding: '8px', borderRadius: 4, border: '1px solid #dadce0', fontSize: '0.85rem' }} />
        <input name="toolType" placeholder="Type (e.g. IDE, API)" required style={{ padding: '8px', borderRadius: 4, border: '1px solid #dadce0', fontSize: '0.85rem' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 12, marginBottom: 12 }}>
        <input name="url" placeholder="URL (optional)" style={{ padding: '8px', borderRadius: 4, border: '1px solid #dadce0', fontSize: '0.85rem' }} />
        <input name="order" type="number" defaultValue="0" required style={{ padding: '8px', borderRadius: 4, border: '1px solid #dadce0', fontSize: '0.85rem' }} />
      </div>
      {error && <p style={{ color: '#EA4335', fontSize: '0.8rem', marginBottom: 12 }}>{error}</p>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={isPending} style={{ background: '#4285F4', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 6, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
          {isPending ? 'Adding...' : 'Add'}
        </button>
        <button type="button" onClick={() => setShow(false)} style={{ background: '#fff', border: '1px solid #dadce0', padding: '6px 16px', borderRadius: 6, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function DeleteConfirmButton({ onConfirm, isPending: propPending, mini }: { onConfirm: () => Promise<void> | void, isPending?: boolean, mini?: boolean }) {
  const [confirming, setConfirming] = useState(false)
  const [internalPending, setInternalPending] = useState(false)
  const isPending = propPending || internalPending

  const handleConfirm = async () => {
    setInternalPending(true)
    await onConfirm()
    setConfirming(false)
    setInternalPending(false)
  }

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)}
        disabled={isPending}
        style={{ background: '#fff', border: '1px solid #dadce0',
          borderRadius: mini ? 6 : 10, padding: mini ? 6 : 8, cursor: isPending ? 'not-allowed' : 'pointer',
          color: '#EA4335', opacity: isPending ? 0.6 : 1 }}>
        <Trash2 size={mini ? 14 : 18} />
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <button onClick={handleConfirm}
        disabled={isPending}
        style={{ background: '#EA4335', color: '#fff', border: 'none',
          borderRadius: mini ? 6 : 8, padding: mini ? '6px 10px' : '8px 14px', cursor: isPending ? 'not-allowed' : 'pointer',
          fontSize: '0.8rem', fontWeight: 700, opacity: isPending ? 0.7 : 1 }}>
        {isPending ? '...' : 'Yes'}
      </button>
      <button onClick={() => setConfirming(false)}
        disabled={isPending}
        style={{ background: '#fff', border: '1px solid #dadce0',
          borderRadius: mini ? 6 : 8, padding: mini ? '6px 10px' : '8px 14px', cursor: isPending ? 'not-allowed' : 'pointer',
          fontSize: '0.8rem', fontWeight: 600 }}>
        No
      </button>
    </div>
  )
}
