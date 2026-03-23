import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight:      '60vh',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      textAlign:      'center',
      padding:        '2rem',
      fontFamily:     "'Google Sans', sans-serif",
    }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <div style={{ width: 16, height: 16, borderRadius: 3,
          background: '#EA4335', transform: 'rotate(45deg)' }} />
        <div style={{ width: 16, height: 16, borderRadius: 3,
          background: '#4285F4', transform: 'rotate(-12deg)' }} />
        <div style={{ width: 16, height: 16, borderRadius: 3,
          background: '#FBBC04', transform: 'rotate(12deg)' }} />
      </div>

      <h1 style={{ fontSize: '4rem', fontWeight: 700,
        letterSpacing: '-0.04em', marginBottom: 8 }}>
        404
      </h1>
      <p style={{ color: '#5F6368', marginBottom: 32 }}>
        This page doesn't exist.
      </p>
      <Link href="/" style={{
        background:     '#4285F4',
        color:          '#fff',
        padding:        '12px 28px',
        borderRadius:   100,
        textDecoration: 'none',
        fontWeight:     700,
      }}>
        Go home
      </Link>
    </div>
  )
}
