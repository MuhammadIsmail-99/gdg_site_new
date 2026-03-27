import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
    ArrowLeft, Github, Linkedin, Instagram, Mail, 
    Code, Star, MessageSquare, Send, CheckCircle2 
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { MemberDetail } from '@/types/member';

async function getMember(slug: string): Promise<MemberDetail> {
  const member = await prisma.member.findUnique({
    where: { slug },
    select: {
      id:            true,
      name:          true,
      slug:          true,
      email:         true,
      role:          true,
      tier:          true,
      imageUrl:      true,
      tagline:       true,
      bio:           true,
      points:        true,
      department:    true,
      linkedin:      true,
      github:        true,
      instagram:     true,
      createdAt:     true,
      isActive:      true,
      skills:        { select: { id: true, skill: true } },
      contributions: true,
      clubMemberships: {
        include: { club: { select: { id: true, name: true, type: true, colorToken: true } } },
      },
    },
  }) as unknown as MemberDetail

  if (!member || !member.isActive) {
    notFound()
  }

  return member
}

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const member = await getMember(slug);

    return (
        <div className="official-profile">
            <style>{`
                :root {
                  --gdg-blue: #4285f4;
                  --gdg-green: #34a853;
                  --gdg-yellow: #f9ab00;
                  --gdg-red: #ea4335;
                  --black: #000000;
                  --gray: #5f6368;
                  --light-gray: #f1f3f4;
                  --border: #e0e0e0;
                }

                .official-profile {
                  font-family: var(--font-primary, 'Inter', system-ui, sans-serif);
                  background: #fff;
                  color: var(--black);
                  min-height: 100vh;
                  padding-bottom: 100px;
                }

                .container { max-width: 1000px; margin: 0 auto; padding: 0 40px; }

                /* ── NAV ── */
                .top-nav { padding: 48px 0; }
                .back-btn { 
                  display: inline-flex; align-items: center; gap: 8px; 
                  color: var(--gray); text-decoration: none; font-size: 14px;
                  font-weight: 500;
                }
                .back-btn:hover { color: var(--gdg-blue); }

                /* ── HERO (FLAT & MINIMAL) ── */
                .hero { padding: 20px 0 60px; border-bottom: 1px solid var(--border); }
                .hero-flex { display: flex; align-items: flex-start; gap: 64px; }
                
                .pfp-wrap {
                  width: 140px; height: 140px; border-radius: 50%;
                  border: 1px solid var(--border); overflow: hidden; flex-shrink: 0;
                }
                .pfp-img { width: 100%; height: 100%; object-fit: cover; }

                .hero-info { flex: 1; }
                .role-header { 
                  display: block; font-size: 12px; font-weight: 700; color: var(--gdg-blue); 
                  text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
                }
                .m-name { font-size: 44px; font-weight: 700; margin: 0 0 16px; letter-spacing: -0.02em; line-height: 1.1; }
                .m-tagline { font-size: 20px; color: var(--gray); margin: 0; font-weight: 400; line-height: 1.5; }

                /* ── LAYOUT ── */
                .main-layout { display: grid; grid-template-columns: 1.6fr 1fr; gap: 80px; padding: 60px 0; }
                
                .section-label { 
                  font-family: var(--font-mono, 'Roboto Mono', monospace);
                  font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; 
                  color: var(--gray); margin-bottom: 24px; display: block;
                }
                
                .bio-content { font-size: 17px; line-height: 1.7; color: #3c4043; margin-bottom: 60px; }
                
                .impact-stack { display: flex; flex-direction: column; gap: 24px; }
                .impact-row { display: flex; gap: 16px; align-items: flex-start; }
                .check { color: var(--gdg-green); flex-shrink: 0; margin-top: 4px; }
                .impact-title { font-size: 17px; font-weight: 700; margin: 0; }
                .impact-desc { font-size: 15px; color: var(--gray); margin: 4px 0 0; line-height: 1.5; }

                /* ── SIDEBAR ── */
                .sidebar { display: flex; flex-direction: column; gap: 56px; }
                .skill-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
                .skill-tag { 
                  padding: 8px 16px; border-radius: 4px; background: var(--light-gray); 
                  font-size: 13px; font-weight: 600; color: var(--black); border: 1px solid transparent;
                }

                .reach-box h3 { font-size: 20px; font-weight: 700; margin: 0 0 16px; }
                .social-list { display: flex; gap: 12px; margin-bottom: 32px; }
                .social-link { 
                  width: 48px; height: 48px; border-radius: 4px; border: 1px solid var(--border);
                  display: flex; align-items: center; justify-content: center; color: var(--gray);
                  transition: all 0.2s;
                }
                .social-link:hover { border-color: var(--black); color: var(--black); background: var(--light-gray); }

                /* OFFICIAL GDG BUTTON ALIGNMENT */
                .btn-primary { 
                  background-color: var(--gdg-blue);
                  color: #fff;
                  padding: 12px 24px;
                  border-radius: 4px;
                  border: none;
                  font-weight: 500;
                  cursor: pointer;
                  display: flex; align-items: center; justify-content: center; gap: 10px;
                  text-decoration: none;
                  width: 100%;
                  font-size: 15px;
                  transition: all 0.2s ease;
                }
                .btn-primary:hover { filter: brightness(1.1); }

                @media (max-width: 860px) {
                  .hero-flex, .main-layout { grid-template-columns: 1fr; flex-direction: column; gap: 32px; }
                  .hero-info { text-align: center; }
                  .pfp-wrap { margin: 0 auto; }
                  .sidebar { padding-top: 40px; border-top: 1px solid var(--border); }
                }
            `}</style>

            <nav className="container top-nav">
                <Link href="/team" className="back-btn">
                    <ArrowLeft size={18} />
                    Directory
                </Link>
            </nav>

            <header className="container hero">
                <div className="hero-flex">
                    <div className="pfp-wrap">
                        <img src={member.imageUrl || '/images/placeholders/member.png'} alt={member.name} className="pfp-img" />
                    </div>
                    <div className="hero-info">
                        <span className="role-header">{member.tier || member.role}</span>
                        <h1 className="m-name">{member.name}</h1>
                        <p className="m-tagline">{member.tagline || `Technical chapter contributor at Google Developer Group on Campus, COMSATS Wah Campus.`}</p>
                    </div>
                </div>
            </header>

            <main className="container main-layout">
                <div className="content">
                    <section className="bio-sec">
                        <span className="section-label">Persona</span>
                        <div className="bio-content">
                           {member.bio || `Helping students grow their technical skills and fostering an inclusive development community at CUI Wah.`}
                        </div>
                    </section>

                    <section className="legacy-sec">
                        <span className="section-label">Chapter Legacy</span>
                        <div className="impact-stack">
                            {member.contributions.length > 0 ? member.contributions.map((c, i) => (
                                <div key={i} className="impact-row">
                                    <CheckCircle2 size={20} className="check" />
                                    <div className="impact-data">
                                        <h4 className="impact-title">{c.title}</h4>
                                        <p className="impact-desc">{c.description || 'Active participation in chapter-level technical initiatives.'}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="impact-row">
                                    <CheckCircle2 size={20} className="check" />
                                    <div className="impact-data">
                                        <h4 className="impact-title">Active Core Contributor</h4>
                                        <p className="impact-desc">Consistently contributing to the technical and community growth of the chapter.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <aside className="sidebar">
                    <div className="skills-group">
                        <span className="section-label">Technical Mastery</span>
                        <div className="skill-wrap">
                            {member.skills.length > 0 ? member.skills.map((s, i) => (
                                <span key={i} className="skill-tag">{s.skill}</span>
                            )) : (
                                ['Frontend Development', 'Web Technologies'].map(n => <span key={n} className="skill-tag">{n}</span>)
                            )}
                        </div>
                    </div>

                    <div className="reach-box">
                        <span className="section-label">Connect</span>
                        <div className="social-list">
                            {member.linkedin && <a href={member.linkedin} className="social-link" target="_blank"><Linkedin size={22} /></a>}
                            {member.github && <a href={member.github} className="social-link" target="_blank"><Github size={22} /></a>}
                            {member.instagram && <a href={member.instagram} className="social-link" target="_blank"><Instagram size={22} /></a>}
                            <a href={`mailto:${member.email}`} className="social-link"><Mail size={22} /></a>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};
