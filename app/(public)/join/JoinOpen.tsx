import { ApplicationForm } from './ApplicationForm'

export function JoinOpen({
  deadline,
  settings,
}: {
  deadline: string | null
  settings: Record<string, string>
}) {
  const instagramUrl = settings.instagram_url ?? ''
  const linkedinUrl  = settings.linkedin_url  ?? ''

  return (
    <div style={{ fontFamily: "var(--font-primary, 'Google Sans', sans-serif)", background: '#fafafa', minHeight: '100vh' }}>
      <style>{`
        .jo-hero {
          background: #fff;
          border-bottom: 1px solid #eee;
          padding: 5rem 1.5rem 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .jo-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.06;
          pointer-events: none;
          background-image: radial-gradient(#000 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .jo-logo-boxes {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }
        .jo-box { width: 28px; height: 28px; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .jo-box-red    { background: #EA4335; transform: rotate(45deg); }
        .jo-box-blue   { background: #4285F4; transform: rotate(-12deg); border-radius: 8px; }
        .jo-box-yellow { background: #FBBC05; transform: rotate(12deg);  border-radius: 8px; }

        .jo-open-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #e6f4ea;
          color: #1e7e34;
          border-radius: 100px;
          padding: 8px 20px;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }
        .jo-pulse {
          width: 8px; height: 8px; border-radius: 50%;
          background: #34a853;
          animation: jo-pulse-anim 1.5s ease-in-out infinite;
        }
        @keyframes jo-pulse-anim {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }

        .jo-title {
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.04em;
          line-height: 1.15;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
        }
        .jo-blue { color: #4285F4; }

        .jo-desc {
          font-size: 1.1rem;
          color: #5f6368;
          line-height: 1.65;
          max-width: 560px;
          margin: 0 auto 2rem;
          position: relative;
          z-index: 1;
        }

        .jo-perks {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
        }
        .jo-perk {
          background: #f1f3f4;
          color: #3c4043;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.82rem;
          font-weight: 500;
        }

        .jo-body {
          max-width: 780px;
          margin: 3rem auto 5rem;
          padding: 0 1.5rem;
        }

        .jo-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.07);
          padding: 2.5rem;
          border: 1px solid #f0f0f0;
        }

        .jo-card-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #202124;
          margin-bottom: 0.4rem;
        }
        .jo-card-sub {
          color: #5f6368;
          font-size: 0.9rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .jo-socials {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f0f0f0;
        }
        .jo-social-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 100px;
          border: 1.5px solid #dadce0;
          color: #3c4043;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .jo-social-link:hover {
          background: #202124;
          color: #fff;
          border-color: #202124;
          opacity: 1;
          transform: translateY(-2px);
        }

        @media (max-width: 600px) {
          .jo-card { padding: 1.5rem; }
          .jo-body  { padding: 0 1rem; }
        }
      `}</style>

      {/* Hero */}
      <div className="jo-hero" data-aos="fade-up">
        <div className="jo-logo-boxes">
          <div className="jo-box jo-box-red" />
          <div className="jo-box jo-box-blue" />
          <div className="jo-box jo-box-yellow" />
        </div>

        <div className="jo-open-badge">
          <span className="jo-pulse" />
          Applications Open
        </div>

        <h1 className="jo-title">
          Join the <span className="jo-blue">GDGoC CUI Wah</span><br />Core Team
        </h1>

        <p className="jo-desc">
          Be part of a community that learns, builds, and grows together.
          Help shape events, workshops, and initiatives for students at CUI Wah.
        </p>

        <div className="jo-perks">
          {['Network with peers', 'Google resources', 'Real-world projects', 'Build leadership skills'].map((p) => (
            <span key={p} className="jo-perk">✓ {p}</span>
          ))}
        </div>
      </div>

      {/* Form card */}
      <div className="jo-body" data-aos="fade-up">
        <div className="jo-card">
          <h2 className="jo-card-title">Submit Your Application</h2>
          <p className="jo-card-sub">
            Fill in the form below. Submitted applications are reviewed by the leadership team.
            You&apos;ll hear back via email.
          </p>

          {deadline && (
            <p style={{ color: '#EA4335', fontWeight: 600, marginBottom: 16 }}>
              Applications close on{' '}
              {new Date(deadline).toLocaleDateString('en-PK', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          )}

          <ApplicationForm deadline={deadline} />

          {/* Social links below form */}
          {(instagramUrl || linkedinUrl) && (
            <div className="jo-socials">
              <span style={{ fontSize: '0.8rem', color: '#9aa0a6', alignSelf: 'center' }}>
                Follow us while you wait:
              </span>
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="jo-social-link">
                  in LinkedIn
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="jo-social-link">
                  📸 Instagram
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
