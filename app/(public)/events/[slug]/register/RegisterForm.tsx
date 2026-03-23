'use client'

import React, { useTransition, useState } from 'react'
import { registerForEvent } from '@/app/actions/event'
import { EventDetail } from '@/types/event'
import { CheckCircle2, User, Phone, Mail, Clock, ChevronRight, MapPin, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface RegisterFormProps {
   event: EventDetail
   user: {
      id: string
      name: string
      email: string
      phoneNumber: string | null
   }
}

export default function RegisterForm({ event, user }: RegisterFormProps) {
   const [isPending, startTransition] = useTransition()
   const [error, setError] = useState<string | null>(null)
   const [success, setSuccess] = useState(false)
   const [agreedToCOC, setAgreedToCOC] = useState(false)

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!agreedToCOC) {
         setError('Required: Agree to Code of Conduct.')
         return
      }
      setError(null)

      startTransition(async () => {
         try {
            const result = await registerForEvent(event.id)
            if (result.error) {
               setError(result.error)
            } else {
               setSuccess(true)
            }
         } catch (err) {
            setError('Something went wrong. Please try again.')
         }
      })
   }

   if (success) {
      return (
         <div className="bento-wrapper">
            <div className="bento-card-compact success-card">
               <div className="google-icon-box" style={{ backgroundColor: '#E6F4EA' }}>
                  <CheckCircle2 color="#34A853" size={24} />
               </div>
               <h2 className="title-compact">Registration Confirmed</h2>
               <p className="desc-compact">Confirmation sent to <strong>{user.email}</strong>.</p>
               <div className="btn-row-success">
                  <Link href="/dashboard" className="success-btn-primary">Dashboard</Link>
                  <Link href="/events" className="success-btn-outline">All Events</Link>
               </div>
            </div>
            <style jsx>{`
            .bento-wrapper { display: flex; justify-content: center; align-items: center; width: 100%; min-height: 400px; padding: 20px; }
            .bento-card-compact { background: white; border: 1px solid #dadce0; border-radius: 1rem; padding: 2.5rem; max-width: 440px; width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; }
            .google-icon-box { width: 54px; height: 54px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
            .title-compact { font-size: 1.5rem; font-weight: 700; color: #202124; margin-bottom: 0.75rem; }
            .desc-compact { color: #5f6368; font-size: 0.95rem; margin-bottom: 2rem; }
            .btn-row-success { display: flex; gap: 12px; width: 100%; }
            .success-btn-primary, .success-btn-outline { flex: 1; padding: 12px; border-radius: 100px; font-weight: 700; text-decoration: none; font-size: 0.9rem; transition: all 0.2s; }
            .success-btn-primary { background: #4285F4; color: white; box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3); }
            .success-btn-primary:hover { background: #1a73e8; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(66, 133, 244, 0.4); }
            .success-btn-outline { border: 2px solid #dadce0; color: #3c4043; }
            .success-btn-outline:hover { background: #f8f9fa; border-color: #bdc1c6; }
        `}</style>
         </div>
      )
   }

   return (
      <div className="bento-outer">
         <div className="bento-bg-shapes">
            <svg width="400" height="400" viewBox="0 0 200 200" fill="currentColor">
               <circle cx="20" cy="20" r="100" fillOpacity="0.04" />
               <rect x="150" y="150" width="100" height="100" rx="20" transform="rotate(15 150 150)" fillOpacity="0.04" />
               <path d="M40 180 Q100 0 160 180" stroke="currentColor" fill="none" strokeWidth="1" strokeLinecap="round" opacity="0.1" />
            </svg>
         </div>

         <div className="bento-card-compact">
            <header className="bento-header-compact">
               <div className="google-icon-box" style={{ backgroundColor: '#E8F0FE' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                     <polyline points="7 10 12 15 17 10"></polyline>
                     <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
               </div>
               <div className="header-text-compact">
                  <h1 className="title-compact">Event Registration</h1>
                  <p className="subtitle-compact">{event.title}</p>
               </div>
            </header>

            <form onSubmit={handleSubmit} className="bento-form-compact">
               <div className="compact-section">
                  <div className="input-row-compact">
                     <div className="compact-group">
                        <label>Member Name</label>
                        <div className="compact-val">{user.name}</div>
                     </div>
                  </div>
                  <div className="compact-group mt-small">
                     <label>Member Email</label>
                     <div className="compact-val">{user.email}</div>
                  </div>
               </div>

               <div className="compact-section-dark">
                  <div className="input-row-compact">
                     <div className="compact-group">
                        <label>Event Timing</label>
                        <div className="compact-val-clean">
                           <Clock size={12} color="#5f6368" />
                           <span>{new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                        </div>
                     </div>
                     <div className="compact-group">
                        <label>Event Format</label>
                        <div className="compact-val-clean">
                           <MapPin size={12} color="#34A853" />
                           <span>{event.locationType || 'In-person'}</span>
                        </div>
                     </div>
                  </div>
               </div>

               <label className="compact-checkbox">
                  <input type="checkbox" checked={agreedToCOC} onChange={(e) => setAgreedToCOC(e.target.checked)} />
                  <span className="cb-mark-compact"></span>
                  <span className="cb-text-compact">Agree to <Link href="/code-of-conduct" className="link-blue-compact">Code of Conduct</Link></span>
               </label>

               {error && <div className="error-alert-compact">{error}</div>}

               <div className="actions-compact-split">
                  <Link href={`/events/${event.slug}`} className="btn-cancel-split">
                     Cancel
                  </Link>
                  <button
                     type="submit"
                     className={`btn-submit-split ${!agreedToCOC || isPending ? 'disabled' : ''}`}
                     disabled={isPending || !agreedToCOC}
                  >
                     {isPending ? 'Syncing...' : 'Register'}
                  </button>
               </div>
            </form>
         </div>

         <style jsx>{`
        .bento-outer {
          width: 100%;
          min-height: 80vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: #fff;
          position: relative;
          overflow: hidden;
        }

        .bento-bg-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #4285F4;
          z-index: 0;
          pointer-events: none;
        }

        .bento-card-compact {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border: 1px solid #dadce0;
          border-radius: 1.25rem;
          padding: 2.25rem;
          position: relative;
          z-index: 1;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .bento-card-compact:hover {
          border-bottom: 3.5px solid #4285F4;
          box-shadow: 0 10px 40px rgba(0,0,0,0.06);
          transform: translateY(-2px);
        }

        .bento-header-compact { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        .google-icon-box { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        
        .header-text-compact { overflow: hidden; }
        .title-compact { font-size: 1.25rem; font-weight: 700; color: #202124; margin: 0; }
        .subtitle-compact { font-size: 0.9rem; color: #5f6368; margin: 2px 0 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .bento-form-compact { display: flex; flex-direction: column; gap: 1.25rem; }
        
        .compact-section { display: flex; flex-direction: column; gap: 0.75rem; }
        .compact-section-dark { padding: 12px; background: #f8f9fa; border-radius: 12px; }
        
        .compact-group label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; color: #70757a; letter-spacing: 0.1em; margin-bottom: 4px; display: block; }
        .compact-val { font-size: 0.9rem; font-weight: 600; color: #202124; }
        .compact-val-clean { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; color: #202124; }
        
        .input-row-compact { display: flex; gap: 1rem; }
        .mt-small { margin-top: 0.25rem; }

        .compact-checkbox { display: flex; align-items: center; gap: 10px; cursor: pointer; color: #3c4043; font-size: 0.85rem; font-weight: 600; }
        .compact-checkbox input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
        .cb-mark-compact { height: 18px; width: 18px; background-color: #fff; border: 1px solid #dadce0; border-radius: 4px; position: relative; flex-shrink: 0; }
        .compact-checkbox:hover input ~ .cb-mark-compact { border-color: #4285F4; }
        .compact-checkbox input:checked ~ .cb-mark-compact { background-color: #4285F4; border-color: #4285F4; }
        .cb-mark-compact:after { content: ""; position: absolute; display: none; left: 6px; top: 2px; width: 4px; height: 8px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }
        .compact-checkbox input:checked ~ .cb-mark-compact:after { display: block; }
        .link-blue-compact { color: #4285F4; font-weight: 700; text-decoration: none; }

        .error-alert-compact { font-size: 0.8rem; color: #EA4335; font-weight: 600; padding: 8px; background: #FEEBE9; border-radius: 8px; text-align: center; border: 1px solid #EA4335; }

        .actions-compact-split { display: flex; align-items: center; gap: 12px; margin-top: 10px; }
        
        .btn-cancel-split { 
          flex: 1;
          color: #3c4043; 
          font-weight: 700; 
          text-decoration: none; 
          font-size: 0.9rem; 
          padding: 12px; 
          border-radius: 8px;
          border: 1.5px solid #dadce0;
          text-align: center;
          transition: all 0.2s;
        }
        .btn-cancel-split:hover { background: #f8f9fa; border-color: #bdc1c6; }
        
        .btn-submit-split { 
           flex: 1; 
           padding: 12px; 
           background: #4285F4; 
           color: white; 
           border: none; 
           border-radius: 8px; 
           font-size: 1rem; 
           font-weight: 700; 
           cursor: pointer; 
           transition: all 0.2s; 
           box-shadow: 0 4px 12px rgba(66, 133, 244, 0.2); 
        }
        .btn-submit-split:hover:not(.disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(66, 133, 244, 0.3); background: #1a73e8; }
        .btn-submit-split.disabled { background: #dadce0; color: #fff; cursor: not-allowed; box-shadow: none; transform: none; }

        @media (max-width: 500px) {
          .bento-card-compact { padding: 1.5rem; }
          .actions-compact-split { flex-direction: column-reverse; }
          .btn-submit-split, .btn-cancel-split { width: 100%; border-radius: 100px; }
        }
      `}</style>
      </div>
   )
}
