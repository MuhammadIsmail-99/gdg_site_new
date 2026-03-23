'use client'

import React, { useState } from 'react'
import { GeneralTab }  from './tabs/GeneralTab'
import { PartnersTab } from './tabs/PartnersTab'
import { ClubsTab }    from './tabs/ClubsTab'
import { Settings, Users, Layers } from 'lucide-react'

type Tab = 'general' | 'partners' | 'clubs'

export function SettingsTabs({
  settingsMap,
  partners,
  clubs,
}: {
  settingsMap: Record<string, string>
  partners:    any[]
  clubs:       any[]
}) {
  const [active, setActive] = useState<Tab>('general')

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'general',  label: 'General',  icon: Settings },
    { key: 'partners', label: 'Partners', icon: Users    },
    { key: 'clubs',    label: 'Clubs',    icon: Layers   },
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
                                  ? '3px solid #EA4335'
                                  : '3px solid transparent',
                cursor:         'pointer',
                fontWeight:     700,
                color:          active === tab.key ? '#EA4335' : '#5F6368',
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
        {active === 'general'  && <GeneralTab  settingsMap={settingsMap} />}
        {active === 'partners' && <PartnersTab partners={partners} />}
        {active === 'clubs'    && <ClubsTab    clubs={clubs} />}
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
