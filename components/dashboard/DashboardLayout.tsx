import React from 'react';
import { SidebarLinks } from './SidebarLinks';
import { LogoutButton } from './LogoutButton';

type NavLink = {
  href:      string
  label:     string
  highlight?: boolean  // true for "+ Add" style links
}

type DashboardLayoutProps = {
  children:    React.ReactNode
  panelLabel:  string
  accentColor: string
  navLinks:    NavLink[]
  user: {
    name:     string
    role:     string
    imageUrl: string | null
  }
}

export default function DashboardLayout({
  children,
  panelLabel,
  accentColor,
  navLinks,
  user,
}: DashboardLayoutProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh',
      fontFamily: "'Google Sans Text', sans-serif" }}>

      {/* Sidebar */}
      <aside 
        data-lenis-prevent
        style={{
          width:        256,
          borderRight:  '1px solid #e8eaed',
          padding:      '1.5rem 1rem',
          background:   '#fff',
          flexShrink:   0,
          display:      'flex',
          flexDirection: 'column',
          position:     'sticky',
          top:          0,
          height:       '100vh',
          overflowY:    'auto',
          msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
          WebkitOverflowScrolling: 'touch', // Smooth swipe for mobile
        }}
      >

        {/* Panel label with accent dot */}
        <div style={{ display: 'flex', alignItems: 'center',
          gap: 8, marginBottom: 28, padding: '0 8px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%',
            background: accentColor, flexShrink: 0 }} />
          <span style={{ fontWeight: 700, fontSize: '0.75rem',
            textTransform: 'uppercase', letterSpacing: '.06em',
            color: '#5F6368' }}>
            {panelLabel}
          </span>
        </div>

        {/* Nav links */}
        <nav style={{ display: 'flex', flexDirection: 'column',
          gap: 2, flex: 1 }}>
          <SidebarLinks links={navLinks} accentColor={accentColor} />
        </nav>

        {/* Signed-in user block */}
        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16,
          marginTop: 16 }}>
          
          <a href="/" style={{ display: 'block', padding: '8px 12px', 
            fontSize: '0.85rem', color: '#5F6368', textDecoration: 'none',
            borderRadius: 8, marginBottom: 4 }}>
            ← Public site
          </a>
          
          <LogoutButton accentColor={accentColor} />

          <div style={{ display: 'flex', alignItems: 'center',
            gap: 10, padding: '8px 10px', borderRadius: 8,
            background: accentColor + '10' }}>
            {user.imageUrl
              ? <img src={user.imageUrl} alt=""
                  style={{ width: 32, height: 32, borderRadius: '50%',
                    objectFit: 'cover', flexShrink: 0 }} />
              : <div style={{ width: 32, height: 32, borderRadius: '50%',
                  background: accentColor + '30', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem',
                  color: accentColor, flexShrink: 0 }}>
                  {user.name.charAt(0)}
                </div>
            }
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: '0.85rem',
                margin: 0, color: '#202124',
                overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap' }}>
                {user.name}
              </p>
              <p style={{ fontSize: '0.75rem', margin: 0,
                color: accentColor, fontWeight: 500,
                textTransform: 'capitalize' }}>
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto',
        background: '#fafafa', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
