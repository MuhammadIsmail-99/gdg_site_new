import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
    ArrowLeft, Github, Linkedin, Instagram, Mail, 
    Code, Globe, Star, MessageSquare, Send, CheckCircle2 
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
        take: 1,
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
        <div className="profile-wrapper">
            <style>{`
                .profile-wrapper { font-family: 'Google Sans', sans-serif; background: #fff; min-height: 100vh; color: #202124; }
                
                .container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
                
                .header-nav { padding: 2rem 0; display: flex; align-items: center; }
                .back-btn { display: flex; align-items: center; gap: 8px; color: #5f6368; text-decoration: none; font-weight: 500; transition: all 0.2s; }
                .back-btn:hover { color: #1a73e8; transform: translateX(-4px); }

                /* HERO SECTION */
                .hero { padding: 4rem 0 6rem; display: grid; grid-template-columns: 350px 1fr; gap: 60px; align-items: center; }
                
                .pp-container { position: relative; width: 350px; height: 350px; }
                .pp-image { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 8px solid #f8f9fa; box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
                
                .brand-shape { position: absolute; z-index: -1; border-radius: 50%; opacity: 0.15; }
                .shape-1 { width: 120px; height: 120px; background: #4285F4; top: -10px; right: -10px; }
                .shape-2 { width: 80px; height: 80px; background: #EA4335; bottom: 20px; left: -30px; }

                .hero-content { display: flex; flex-direction: column; gap: 1rem; }
                .member-role { font-size: 14px; font-weight: 700; color: #1a73e8; text-transform: uppercase; letter-spacing: 0.12em; }
                .member-name { font-size: 4.5rem; font-weight: 700; letter-spacing: -0.04em; line-height: 1; margin: 0; }
                .member-tagline { font-size: 1.5rem; color: #5f6368; font-weight: 400; line-height: 1.4; }

                .club-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 14px;
                    border-radius: 100px;
                    font-size: 13px;
                    font-weight: 600;
                    width: fit-content;
                }

                /* STATS/SOCIALS STRIP */
                .social-strip { display: flex; gap: 12px; margin-top: 1rem; }
                .social-circ { 
                    width: 48px; height: 48px; border-radius: 50%; background: #f1f3f4; 
                    display: flex; align-items: center; justify-content: center; color: #3c4043;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); text-decoration: none;
                }
                .social-circ:hover { background: #202124; color: #fff; transform: translateY(-4px); box-shadow: 0 8px 15px rgba(0,0,0,0.1); }

                /* CONTENT GRID */
                .content-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 80px; padding: 6rem 0; border-top: 1px solid #f1f3f4; }
                
                .section-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 2rem; display: flex; align-items: center; gap: 12px; }
                .bio-text { font-size: 1.125rem; line-height: 1.7; color: #3c4043; margin-bottom: 3rem; }

                .contribution-list { display: flex; flex-direction: column; gap: 24px; }
                .contribution-item { display: flex; gap: 16px; align-items: flex-start; }
                .check-box { margin-top: 4px; color: #34a853; flex-shrink: 0; }
                .contrib-text-container { flex: 1; }
                .contrib-title { font-size: 18px; color: #1a1a1a; font-weight: 700; margin: 0; }
                .contrib-desc { font-size: 15px; color: #5f6368; margin: 4px 0 0; line-height: 1.5; }

                /* SIDEBAR SKILLS */
                .skills-box { background: #f8f9fa; padding: 2.5rem; border-radius: 32px; height: fit-content; }
                .skill-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 1.5rem; }
                .skill-tag { padding: 8px 16px; background: #fff; border: 1px solid #dadce0; border-radius: 12px; font-size: 14px; font-weight: 600; color: #3c4043; }

                /* REACH OUT SECTION */
                .reach-out { 
                    margin: 4rem 0 8rem; padding: 4rem; background: #1a73e8; border-radius: 40px; 
                    color: #fff; display: flex; justify-content: space-between; align-items: center;
                }
                .reach-text h2 { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; }
                .reach-text p { opacity: 0.9; font-size: 1.125rem; }
                .reach-btns { display: flex; gap: 16px; }
                .cta-white { 
                    background: #fff; color: #1a73e8; padding: 16px 32px; border-radius: 12px; 
                    font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 10px;
                    transition: all 0.2s;
                }
                .cta-white:hover { transform: scale(1.05); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

                @media (max-width: 900px) {
                    .hero { grid-template-columns: 1fr; text-align: center; }
                    .pp-container { margin: 0 auto; width: 280px; height: 280px; }
                    .member-name { font-size: 3rem; }
                    .content-grid { grid-template-columns: 1fr; gap: 40px; }
                    .reach-out { flex-direction: column; text-align: center; gap: 30px; padding: 3rem 1.5rem; }
                    .social-strip { justify-content: center; }
                    .hero-content { align-items: center; }
                }
            `}</style>

            <div className="container">
                <nav className="header-nav">
                    <Link href="/team" className="back-btn">
                        <ArrowLeft size={20} />
                        Directory
                    </Link>
                </nav>

                {/* HERO */}
                <header className="hero">
                    <div className="pp-container">
                        <div className="brand-shape shape-1"></div>
                        <div className="brand-shape shape-2"></div>
                        <img src={member.imageUrl || '/images/placeholders/member.png'} alt={member.name} className="pp-image" />
                    </div>

                    <div className="hero-content">
                        <span className="member-role">{member.tier || member.role}</span>
                        
                        {member.clubMemberships?.[0] && (
                            <div className="club-pill" style={{ 
                                background: (member.clubMemberships[0].club.colorToken ?? '#4285F4') + '15',
                                color: member.clubMemberships[0].club.colorToken ?? '#185FA5',
                                border: `1px solid ${member.clubMemberships[0].club.colorToken ?? '#4285F4'}40`
                            }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: member.clubMemberships[0].club.colorToken ?? '#4285F4' }} />
                                {member.clubMemberships[0].club.name}
                            </div>
                        )}

                        <h1 className="member-name">{member.name}</h1>
                        <p className="member-tagline">{member.tagline}</p>

                        <div className="social-strip">
                            {member.linkedin && (
                                <a href={member.linkedin} className="social-circ" target="_blank">
                                    <Linkedin size={20} />
                                </a>
                            )}
                            {member.github && (
                                <a href={member.github} className="social-circ" target="_blank">
                                    <Github size={20} />
                                </a>
                            )}
                            {member.instagram && (
                                <a href={member.instagram} className="social-circ" target="_blank">
                                    <Instagram size={20} />
                                </a>
                            )}
                            <a href={`mailto:${member.id}@student.cuiwah.edu.pk`} className="social-circ">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT */}
                <main className="content-grid">
                    <section>
                        <div className="section-title">
                            <Star className="text-yellow-500" style={{ color: '#FBBC05' }} />
                            The Persona
                        </div>
                        <p className="bio-text">{member.bio || 'This member has not written a bio yet.'}</p>

                        <div className="section-title" style={{ marginTop: '4rem' }}>
                            <CheckCircle2 className="text-green-500" style={{ color: '#34A853' }} />
                            Chapter Impact
                        </div>
                        <div className="contribution-list">
                            {member.contributions.length > 0 ? member.contributions.map((c, i) => (
                                <div key={i} className="contribution-item">
                                    <CheckCircle2 size={18} className="check-box" />
                                    <div className="contrib-text-container">
                                        <h4 className="contrib-title">{c.title}</h4>
                                        <p className="contrib-desc">{c.description}</p>
                                    </div>
                                </div>
                            )) : (
                                <p style={{ color: '#5f6368' }}>No contributions listed yet.</p>
                            )}
                        </div>
                    </section>

                    <aside>
                        <div className="skills-box">
                            <div className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                                <Code className="text-blue-500" style={{ color: '#4285F4' }} />
                                Expertise
                            </div>
                            <p style={{ fontSize: '14px', color: '#5f6368' }}>Technical domains and industry-standard skills.</p>
                            <div className="skill-tags">
                                {member.skills.length > 0 ? member.skills.map((s, i) => (
                                    <span key={i} className="skill-tag">{s.skill}</span>
                                )) : (
                                    <span style={{ fontSize: '13px', color: '#9aa0a6' }}>No skills listed.</span>
                                )}
                            </div>

                            <div className="section-title" style={{ fontSize: '1.25rem', marginTop: '3rem', marginBottom: '1rem' }}>
                                <MessageSquare className="text-red-500" style={{ color: '#EA4335' }} />
                                Reach Out
                            </div>
                            <p style={{ fontSize: '14px', color: '#5f6368', marginBottom: '1.5rem' }}>Open for networking and mentorship.</p>
                            <a href={`mailto:gdg.cui@gmail.com`} className="cta-white" style={{ background: '#f1f3f4', color: '#202124', justifyContent: 'center' }}>
                                <Send size={16} />
                                Send Message
                            </a>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
};
