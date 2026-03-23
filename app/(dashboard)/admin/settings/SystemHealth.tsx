'use client'

import React from 'react'
import { Activity, Database, CheckCircle, Smartphone, PenTool, Users, Megaphone } from 'lucide-react'

export function SystemHealth({
  stats
}: {
  stats: {
    memberCount:       number
    eventCount:        number
    postCount:         number
    partnerCount:      number
    clubCount:         number
    settingCount:      number
    announcementCount: number
  }
}) {
  const healthItems = [
    { label: 'Active Members',   value: stats.memberCount,       icon: Users      },
    { label: 'Live Events',      value: stats.eventCount,        icon: Smartphone },
    { label: 'Journal Posts',    value: stats.postCount,         icon: PenTool    },
    { label: 'Active Partners',  value: stats.partnerCount,      icon: Database   },
    { label: 'Learning Tracks',  value: stats.clubCount,         icon: Activity   },
    { label: 'Settings Scope',   value: `${stats.settingCount} keys`, icon: Database   },
    { label: 'Broadcasts',       value: stats.announcementCount, icon: Megaphone  },
    { label: 'System Gateway',   value: 'Operational',           icon: CheckCircle, color: '#34A853' },
  ]

  return (
    <div style={{ marginTop: 64, padding: 32, background: '#fff', borderRadius: 20, border: '1px solid #e0e0e0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Activity size={20} color="#EA4335" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#5F6368', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Real-time System Audit
        </h3>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {healthItems.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} style={{ background: '#f8f9fa', padding: '20px', borderRadius: 16, border: '1px solid #f0f0f0', transition: 'transform 0.2s', cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <p style={{ fontSize: '0.75rem', color: '#5F6368', margin: 0, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                  {item.label}
                </p>
                <Icon size={16} color={item.color || '#5F6368'} style={{ opacity: 0.6 }} />
              </div>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: item.color || '#202124' }}>
                {item.value}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
