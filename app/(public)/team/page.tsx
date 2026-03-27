import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { prisma } from '@/lib/prisma';

interface TeamCardProps {
  name: string;
  role: string;
  imageUrl: string;
  slug: string;
}

const TeamCard = ({ name, role, imageUrl, slug }: TeamCardProps) => (
  <Link href={`/team/${slug}`} style={{ textDecoration: 'none' }}>
    <div className="team-card">
      <div className="card-content">
        <div className="image-container">
          <img src={imageUrl} alt={name} className="profile-img" />
          <div className="overlay">
            <ExternalLink size={16} color="white" />
          </div>
        </div>
        <div className="text-content">
          <h3 className="member-name">{name}</h3>
          <p className="member-role">{role}</p>
        </div>
      </div>
    </div>
  </Link>
);

const LeadershipCard = ({ name, role, imageUrl, slug, size = "100px" }: any) => (
  <Link href={`/team/${slug}`} style={{ textDecoration: 'none' }}>
    <div className="leadership-card">
      <div className="lead-img-container" style={{ width: size, height: size }}>
        <img src={imageUrl} alt={name} className="lead-img" style={{ width: '100%', height: '100%', marginBottom: 0 }} />
        <div className="overlay lead-overlay">
          <ExternalLink size={20} color="white" />
        </div>
      </div>
      <h3 className="member-name" style={{ marginTop: '1rem' }}>{name}</h3>
      <p className="member-role">{role}</p>
    </div>
  </Link>
);

export default async function TeamPage() {
  let members: any[] = [];
  try {
    members = await prisma.member.findMany({
      where: { isActive: true },
      select: { id: true, role: true, department: true }
    });
  } catch (error) {
    console.warn('⚠️ Could not fetch members for /team during build.');
  }

  const coreLeads = members.filter(m => ['core', 'admin'].includes(m.role));
  const departments = [...new Set(members.map(m => (m as any).department).filter(Boolean))];

  return (
    <div className="app-container">
      <style>{`
        :root {
          --google-blue: #4285F4;
          --bg-gray: #f8f9fa;
          --text-main: #1f1f1f;
          --text-sub: #5f6368;
          --border-light: #e0e0e0;
          --line-color: #d1d5db;
        }

        .app-container {
          min-height: 100vh;
          background-color: var(--bg-gray);
          font-family: var(--font-primary, 'Google Sans', 'Roboto', system-ui, -apple-system, sans-serif);
          color: var(--text-main);
          margin: 0;
          padding: 0;
        }

        .hero {
            padding: 8rem 1.5rem 4rem 1.5rem;
            position: relative;
            overflow: hidden;
            background: white;
            border-bottom: 1px solid #e0e0e0;
        }

        .hero::before {
            content: "";
            position: absolute;
            top: -150px;
            right: -100px;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(251, 188, 4, 0.15) 0%, transparent 70%);
            z-index: 0;
            border-radius: 50%;
            pointer-events: none;
        }

        .hero-content {
            position: relative;
            z-index: 1;
            max-width: 1100px;
            margin: 0 auto;
            text-align: left;
        }

        .hero-breadcrumb {
            display: flex;
            gap: 8px;
            align-items: center;
            font-size: 0.85rem;
            font-weight: 500;
            color: var(--text-sub);
            margin-bottom: 1.25rem;
        }

        .hero-breadcrumb .dot-sep {
            width: 4px;
            height: 4px;
            background: #dadce0;
            border-radius: 50%;
        }

        .hero-title {
            font-family: 'Product Sans', sans-serif;
            font-size: clamp(2.2rem, 5vw, 3.5rem);
            line-height: 1.1;
            margin-bottom: 1rem;
            color: #1a1a1a;
            letter-spacing: -0.02em;
        }

        .hero-title span { 
            color: #FBBC04;
        }

        .hero-subtitle {
            font-size: 1.15rem;
            color: var(--text-sub);
            max-width: 650px;
            margin-bottom: 2rem;
            line-height: 1.5;
        }

        .hero-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
            color: var(--text-sub);
            font-weight: 500;
            padding: 6px 14px;
            background: #f8f9fa;
            border-radius: 100px;
        }

        .meta-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }

        @media (max-width: 768px) {
            .hero { padding: 6rem 1.5rem 4rem 1.5rem; }
            .hero-title { font-size: 2.5rem; }
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .vertical-line {
          width: 1px;
          height: 60px;
          background-color: var(--line-color);
        }

        .section-label {
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #1a1a1a;
          margin-bottom: 2rem;
          display: block;
        }

        .leadership-card {
          background: white;
          padding: 2.5rem;
          border-radius: 24px;
          border: 1px solid var(--border-light);
          text-align: center;
          width: 320px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          align-items: center; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .leadership-card:hover {
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border-color: #f1f3f4;
        }

        .leadership-card { cursor: pointer; }
        .leadership-card:hover .overlay { opacity: 1; }

        .lead-img-container {
          position: relative;
          border-radius: 50%;
          overflow: hidden;
          background: #f1f3f4;
          border: 4px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .lead-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .lead-overlay { border-radius: 50%; }

        .core-container {
          background: white;
          border: 1px solid var(--border-light);
          border-radius: 40px;
          padding: 4rem 2rem;
          width: 100%;
          text-align: center;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          width: 100%;
          margin-top: 2rem;
        }

        .team-card {
          background: #fff;
          padding: 1.25rem;
          border-radius: 20px;
          border: 1px solid #f1f3f4;
          transition: all 0.3s ease;
          text-align: left;
        }

        .team-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }

        .card-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .image-container {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }

        .profile-img { width: 100%; height: 100%; object-fit: cover; }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .team-card:hover .overlay { opacity: 1; }

        .member-name { 
          margin: 0; 
          font-weight: 700; 
          font-size: 16px; 
          color: #1a1a1a; 
        }

        .member-role { 
          margin: 4px 0 0; 
          font-size: 10px; 
          font-weight: 800; 
          text-transform: uppercase; 
          letter-spacing: 0.1em;
          color: var(--text-sub);
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
          .team-grid { grid-template-columns: 1fr; }
          .core-container { padding: 2rem 1rem; }
        }

        .cta-section { width: 100%; padding: 5rem 0; background: white; margin-top: 2rem; border-top: 1px solid var(--border-light); overflow: hidden; }
        .brace-container { display: flex; align-items: center; justify-content: center; max-width: 1100px; margin: 0 auto; width: 100%; padding: 0 2rem; }
        .brace-wrapper { flex-shrink: 0; }
        .brace-svg { height: 100px; width: auto; opacity: 0.8; }
        .cta-content { flex-grow: 1; text-align: center; padding: 0 0.5rem; }
        .cta-title { font-size: 1.5rem; font-weight: 500; color: #202124; margin-bottom: 0.75rem; letter-spacing: -0.02em; line-height: 1.1; font-family: 'Product Sans', sans-serif; }
        .cta-desc { font-size: 0.9rem; color: #5f6368; line-height: 1.4; margin-bottom: 1.25rem; }
        .cta-hashtag { font-weight: 700; color: #202124; }
        .cta-yellow-link { display: inline-flex; align-items: center; color: #FBBC04; font-weight: 700; font-size: 0.95rem; text-decoration: none; transition: opacity 0.2s; border-bottom: 2px solid transparent; padding-bottom: 2px; }
        .cta-yellow-link:hover { opacity: 0.8; border-bottom-color: #FBBC04; }
        .cta-yellow-link::after { content: '→'; margin-left: 6px; font-size: 1rem; transition: transform 0.2s; }
        .cta-yellow-link:hover::after { transform: translateX(4px); }

        @media (min-width: 768px) {
            .brace-svg { height: 160px; }
            .cta-content { padding: 0 1.5rem; }
            .cta-title { font-size: 2.2rem; }
            .cta-desc { font-size: 1rem; }
            .hide-mobile { display: block; }
        }

        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <header className="hero">
        <div className="hero-content">
          <nav className="hero-breadcrumb">
            <span>GDGOC</span> <span className="dot-sep"></span> <span style={{ color: "#FBBC04" }}>Our Team</span>
          </nav>
          <h1 className="hero-title">The <span>Minds</span> behind the magic.</h1>
          <p className="hero-subtitle">Meet the leads, developers, and designers working tirelessly to bring world-class events and resources to our campus.</p>
          <div className="hero-meta">
            <div className="meta-item"><span className="meta-dot" style={{ background: "#FBBC04" }}></span> {coreLeads.length} Core Leads</div>
            <div className="meta-item"><span className="meta-dot" style={{ background: "#EA4335" }}></span> {departments.length} Departments</div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="section-label">Leadership</span>
          <LeadershipCard name="Dr. Kashif Ayyub" role="Faculty Advisor" imageUrl="/images/team/kashif_ayub.png" slug="kashif-ayub" />

          <div className="vertical-line"></div>

          <LeadershipCard name="Ubaid Ghazi" role="Campus Lead" imageUrl="/images/team/ubaid.png" slug="ubaid" size="110px" />
        </section>

        <div className="vertical-line" style={{ height: '80px' }}></div>

        <div className="core-container">
          <span className="section-label">Core Team</span>
          <div className="team-grid">
            <TeamCard name="Laiba Faiz" role="Chairperson" imageUrl="/images/team/laiba_faiz.png" slug="laiba-faiz" />
            <TeamCard name="Junaid Mehmood" role="General Secretary" imageUrl="/images/team/junaid_mehmood.png" slug="junaid-mehmood" />
            <TeamCard name="M. Tashfeen" role="Operation Manager" imageUrl="/images/team/m_tashfeen.png" slug="m-tashfeen" />
            <TeamCard name="Alisha Fatima" role="Women in Tech Lead" imageUrl="/images/team/Alisha_fatima.png" slug="alisha-fatima" />
            <TeamCard name="Saad Ali" role="Community Manager" imageUrl="/images/team/saad_ali.png" slug="saad-ali" />
            <TeamCard name="Adeel Asghar" role="Tech Lead" imageUrl="/images/team/adeel_asghar.png" slug="adeel" />
          </div>
        </div>

        <div className="vertical-line" style={{ height: '80px' }}></div>

        <section style={{ width: '100%', textAlign: 'center' }}>
          <span className="section-label">Domain Leads</span>
          <p style={{ fontSize: '14px', color: '#5f6368', marginBottom: '2rem' }}>Specialists leading each technology vertical</p>
          <div className="team-grid">
            <TeamCard name="Muhammad Ismail" role="Web & App Lead" imageUrl="/images/team/m_ismail.jpeg" slug="ismail" />
            <TeamCard name="Manahil Mirza" role="Data Science Lead" imageUrl="/images/team/manahil_mirza.png" slug="manahil-mirza" />
            <TeamCard name="Maleeha Zulfiqar" role="Gen AI Lead" imageUrl="/images/team/maleeha_zulfiqr.png" slug="maleeha-zulfiqr" />
            <TeamCard name="Ayesha Akhtar" role="Events Lead" imageUrl="/images/team/ayesha_akhtar.png" slug="ayesha-akhtar" />
            <TeamCard name="Muhammad Yousaf" role="Graphics Lead" imageUrl="/images/team/m_yousasf.png" slug="m-yousaf" />
            <TeamCard name="Fatima Qureshi" role="Social Media Lead" imageUrl="/images/team/fatima_qureshi.png" slug="fatima-qureshi" />
          </div>
        </section>
      </main>

      <section className="cta-section animate-fade-in">
        <div className="brace-container">
          {/* Left Brace */}
          <div className="brace-wrapper">
            <svg className="brace-svg" viewBox="0 0 60 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10C50 10 25 10 25 35V85C25 95 10 100 10 100C10 100 25 105 25 115V165C25 190 50 190 50 190"
                stroke="#202124" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Content */}
          <div className="cta-content">
            <h2 className="cta-title">
              Join our GDG on <br className="hide-mobile" /> Campus Chapter
            </h2>

            <p className="cta-desc">
              Connect with fellow student developers, <br />
              build projects, and grow your skills with <br />
              <span className="cta-hashtag">#GDGoC Team</span>.
            </p>

            <Link href="/join" className="cta-yellow-link">Register Now</Link>
          </div>

          {/* Right Brace */}
          <div className="brace-wrapper">
            <svg className="brace-svg" viewBox="0 0 60 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10C10 10 35 10 35 35V85C35 95 50 100 50 100C50 100 35 105 35 115V165C35 190 10 190 10 190"
                stroke="#202124" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}
