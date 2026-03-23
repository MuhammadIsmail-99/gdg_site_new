import Link from 'next/link'
import { Instagram, Linkedin, ArrowLeft, Lock } from 'lucide-react'

export function JoinClosed({
  message,
  settings,
}: {
  message:  string
  settings: Record<string, string>
}) {
  const instagramUrl = settings.instagram_url ?? 'https://instagram.com/gdgoc_cuiwah'
  const linkedinUrl  = settings.linkedin_url  ?? 'https://linkedin.com/company/gdgoc-cui-wah'

  return (
    <div className="join-root">
      <style>{`
        .join-root {
          font-family: var(--font-primary, 'Google Sans', sans-serif);
          background: #fff;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 4rem 1.5rem;
        }

        .join-root::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.06;
          pointer-events: none;
          background-image: radial-gradient(#000 1px, transparent 1px);
          background-size: 30px 30px;
        }

        .hero-content {
          max-width: 800px;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .logo-boxes {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-bottom: 2rem;
        }

        .box { width: 28px; height: 28px; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .box-red    { background: #EA4335; transform: rotate(45deg); }
        .box-blue   { background: #4285F4; transform: rotate(-12deg); border-radius: 8px; }
        .box-yellow { background: #FBBC05; transform: rotate(12deg);  border-radius: 8px; }

        .closed-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fce8e6;
          color: #c62828;
          border-radius: 100px;
          padding: 8px 20px;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 2rem;
        }

        .join-title {
          font-size: 3rem;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.04em;
          line-height: 1.2;
          margin-bottom: 1.25rem;
        }

        .highlight { color: #4285F4; }

        .join-desc {
          font-size: 1.125rem;
          color: #5f6368;
          line-height: 1.6;
          max-width: 550px;
          margin: 0 auto 2.5rem;
        }

        .social-row {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .social-link {
          padding: 14px 28px;
          border-radius: 50px;
          border: 1.5px solid #dadce0;
          color: #3c4043;
          font-weight: 600;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s;
        }
        .social-link:hover {
          background: #202124;
          color: #fff;
          transform: translateY(-3px);
          opacity: 1;
          border-color: #202124;
        }

        .back-home {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #5f6368;
          font-weight: 700;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .back-home:hover { color: #000; opacity: 1; }

        @media (max-width: 768px) {
          .join-title { font-size: 2.2rem; }
          .social-row { flex-direction: column; align-items: center; }
          .social-link { width: 100%; max-width: 300px; justify-content: center; }
        }
      `}</style>

      <main className="hero-content" data-aos="fade-up">
        <div className="logo-boxes">
          <div className="box box-red" />
          <div className="box box-blue" />
          <div className="box box-yellow" />
        </div>

        <div className="closed-badge">
          <Lock size={14} />
          Applications Closed
        </div>

        <h1 className="join-title">
          {message.includes('Out of Session') || message.toLowerCase().includes('closed') ? (
            <>Applications Are <br /><span className="highlight">Currently Out of Session</span></>
          ) : (
            <span className="highlight">{message}</span>
          )}
        </h1>

        <p className="join-desc">
          The Chapter Core Team selection has formally concluded. Join us at our
          upcoming events while you wait for the next recruitment cycle.
        </p>

        <div className="social-row">
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-link">
              <Linkedin size={20} />
              Follow LinkedIn
            </a>
          )}
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="social-link">
              <Instagram size={20} />
              On Instagram
            </a>
          )}
        </div>

        <div style={{ borderTop: '1px solid #f1f3f4', paddingTop: '2.5rem', marginTop: '1rem' }}>
          <Link href="/" className="back-home">
            <ArrowLeft size={18} />
            Back to Clubhouse
          </Link>
        </div>
      </main>
    </div>
  )
}
