'use client'

import React, { useState, useActionState } from 'react'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { changePassword } from '@/app/actions/profile'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  border: '1px solid #dadce0', borderRadius: 10,
  fontSize: '0.95rem', boxSizing: 'border-box',
  fontFamily: 'inherit', outline: 'none'
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      fontSize: '0.75rem', fontWeight: 700,
      color: '#5F6368', display: 'block', marginBottom: 8,
      textTransform: 'uppercase', letterSpacing: '.04em'
    }}>
      {children}
    </label>
  )
}

export default function SecurityTab({ memberId }: { memberId: string }) {
  const [state, formAction, isPending] = useActionState(changePassword, undefined)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div style={{ maxWidth: 480 }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, color: '#202124' }}>
        Security
      </h2>
      <p style={{ color: '#5F6368', marginBottom: 32, fontSize: '0.9rem' }}>
        Change your account password. We recommend using a unique password that you don't use elsewhere.
      </p>

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <Label>Current Password</Label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showCurrent ? 'text' : 'password'} 
              name="currentPassword" 
              required 
              style={inputStyle} 
            />
            <button 
              type="button" 
              onClick={() => setShowCurrent(!showCurrent)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#5F6368' }}
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <Label>New Password</Label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showNew ? 'text' : 'password'} 
              name="newPassword" 
              required 
              minLength={8}
              style={inputStyle} 
            />
            <button 
              type="button" 
              onClick={() => setShowNew(!showNew)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#5F6368' }}
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <Label>Confirm New Password</Label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showConfirm ? 'text' : 'password'} 
              name="confirmPassword" 
              required 
              style={inputStyle} 
            />
            <button 
              type="button" 
              onClick={() => setShowConfirm(!showConfirm)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#5F6368' }}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {state && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: state.includes('successfully') ? '#34A853' : '#EA4335', fontSize: '0.9rem', fontWeight: 600 }}>
            {state.includes('successfully') ? <ShieldCheck size={18} /> : null}
            <span>{state}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          style={{
            background: '#EA4335', color: '#fff', border: 'none',
            padding: '12px 32px', borderRadius: 8, fontWeight: 700,
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.7 : 1, fontSize: '0.95rem',
            boxShadow: '0 4px 12px rgba(234, 67, 53, 0.2)',
            alignSelf: 'flex-start'
          }}
        >
          {isPending ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
