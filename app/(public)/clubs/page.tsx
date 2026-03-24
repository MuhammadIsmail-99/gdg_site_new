import React from 'react';
import { prisma } from '@/lib/prisma';

async function getClubs() {
    return prisma.club.findMany({
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
        include: {
            _count: { select: { memberships: true } }
        }
    });
}

async function getMemberCount() {
    return prisma.member.count({ where: { isActive: true } });
}

import { auth } from '@/auth';
import {
    Code2,
    BarChart3,
    Zap,
    PenTool,
    TrendingUp,
    Calendar,
    Users,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
    'code': Code2,
    'bar-chart': BarChart3,
    'zap': Zap,
    'pen-tool': PenTool,
    'trending-up': TrendingUp,
    'calendar': Calendar,
};

export default async function ClubsPage() {
    let clubs: any[] = [];
    let totalMemberCount = 0;
    let myClubId: string | null = null;
    let session = null;

    try {
        [clubs, totalMemberCount, session] = await Promise.all([
            getClubs(),
            getMemberCount(),
            auth()
        ]);
        
        if (session?.user?.id) {
            const membership = await prisma.clubMembership.findFirst({
                where: { memberId: session.user.id },
                select: { clubId: true },
            });
            myClubId = membership?.clubId ?? null;
        }
    } catch (error) {
        console.warn('⚠️ Could not fetch data for /clubs during build (database unreachable). Prerendering empty page.');
        // Prerendering with empty data
    }

    const technical = clubs.filter(c => c.type === 'technical');
    const creative = clubs.filter(c => c.type === 'creative');

    return (
        <div className="clubs-container">
            <style>{`
                :root {
                    --g-blue: #4285F4;
                    --g-red: #EA4335;
                    --g-yellow: #FBBC04;
                    --g-green: #34A853;
                    --g-gray: #5F6368;
                    --g-border: #dadce0;
                    --g-text-main: #202124;
                    --g-text-sub: #5F6368;
                }

                .clubs-container {
                    min-height: 100vh;
                    background-color: #ffffff;
                    color: var(--g-text-main);
                    line-height: 1.5;
                    -webkit-font-smoothing: antialiased;
                    font-family: 'Google Sans Text', sans-serif;
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
                    background: radial-gradient(circle, rgba(52, 168, 83, 0.15) 0%, transparent 70%);
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
                    color: var(--g-text-sub);
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
                    color: var(--g-text-main);
                    letter-spacing: -0.02em;
                }

                .hero-title span { 
                    color: var(--g-green);
                }

                .hero-subtitle {
                    font-size: 1.15rem;
                    color: var(--g-text-sub);
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
                    color: var(--g-gray);
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
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 4rem 1.5rem 8rem 1.5rem;
                }

                .section {
                    margin-bottom: 5rem;
                }

                .section-header {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 2.5rem;
                }

                .section-label {
                    letter-spacing: 0.1em;
                    font-weight: 700;
                    font-size: 0.75rem;
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                }

                .section-title {
                    font-size: 2.25rem;
                    font-weight: 700;
                    color: var(--g-text-main);
                }

                .bento-grid {
                    display: grid;
                    grid-template-columns: repeat(12, 1fr);
                    gap: 1.25rem;
                }

                .bento-card {
                    background: #ffffff;
                    border: 1px solid var(--g-border);
                    border-radius: 1rem;
                    padding: 2rem;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    z-index: 1;
                    height: 100%;
                }

                .col-span-4 { grid-column: span 4; }
                .col-span-6 { grid-column: span 6; }
                .col-span-8 { grid-column: span 8; }
                .col-span-12 { grid-column: span 12; }

                @media (max-width: 768px) {
                    .col-span-4, .col-span-6, .col-span-8 {
                        grid-column: span 12;
                    }
                    .section-title {
                        font-size: 1.875rem;
                    }
                    .hero-title {
                        font-size: 3rem;
                    }
                }

                .bento-card:hover {
                    border-color: #d1d4d7;
                    box-shadow: 0 12px 32px rgba(60, 64, 67, 0.08);
                    transform: translateY(-4px);
                }

                .card-tag {
                    align-self: flex-start;
                    background: #f8f9fa;
                    color: #5f6368;
                    padding: 4px 12px;
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    margin-bottom: 1.25rem;
                    border: 1px solid #e8eaed;
                }

                .my-club-active {
                    background: #e6f4ea;
                    color: #137333;
                    border-color: #ceead6;
                }

                .icon-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.25rem;
                    position: relative;
                    transition: transform 0.3s ease;
                }

                .bento-card:hover .icon-box {
                    transform: scale(1.05);
                }

                .icon-box::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: currentColor;
                    opacity: 0.08;
                    border-radius: inherit;
                }

                .card-title {
                    font-size: 1.35rem;
                    font-weight: 700;
                    margin-bottom: 0.6rem;
                    color: #202124;
                    letter-spacing: -0.01em;
                }

                .card-description {
                    color: #5f6368;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    margin-bottom: 1.75rem;
                    flex-grow: 1;
                }

                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 1.5rem;
                    border-top: 1px solid #f1f3f4;
                }

                .member-pill {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #5f6368;
                }

                .explore-link {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: inherit;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    opacity: 0.7;
                    transition: opacity 0.2s, gap 0.2s;
                    text-decoration: none;
                }

                .bento-card:hover .explore-link {
                    opacity: 1;
                    gap: 8px;
                }

                .max-w-2xl { max-width: 42rem; }
                .max-w-3xl { max-width: 48rem; }
            `}</style>

            <header className="hero">
                <div className="hero-content">
                    <nav className="hero-breadcrumb">
                        <span>GDGOC</span> <span className="dot-sep"></span> <span style={{ color: "var(--g-green)" }}>The Club</span>
                    </nav>
                    <h1 className="hero-title">Building a <span>Community</span> of innovators.</h1>
                    <p className="hero-subtitle">Our mission is to empower students through technology, mentorship, and a global network of passionate creators.</p>
                    <div className="hero-meta">
                        <div className="meta-item"><span className="meta-dot" style={{ background: "var(--g-green)" }}></span> {totalMemberCount}+ Members</div>
                        <div className="meta-item"><span className="meta-dot" style={{ background: "var(--g-blue)" }}></span> Established 2023</div>
                    </div>
                </div>
            </header>

            <main className="main-content">

                {/* Tech Clubs Section */}
                <div className="section">
                    <div className="section-header">
                        <span className="section-label" style={{ color: "var(--g-blue)" }}>Build & Engineer</span>
                        <h2 className="section-title">Technical Tracks</h2>
                    </div>

                    <div className="bento-grid">
                        {technical.map((club, idx) => {
                            const span = 'col-span-4';
                            const isMyClub = club.id === myClubId;
                            const IconCmp = (club.iconType ? iconMap[club.iconType] : null) || Code2;
                            return (
                                <div key={club.id} className={`bento-card ${span}`} style={{ color: club.colorToken || 'var(--g-blue)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div className="icon-box">
                                            <IconCmp size={24} style={{ color: club.colorToken || 'var(--g-blue)' }} />
                                        </div>
                                        {isMyClub && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', fontWeight: 800, color: '#137333', background: '#e6f4ea', padding: '4px 10px', borderRadius: 100 }}>
                                                <CheckCircle2 size={12} /> JOINED
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="card-title">{club.name}</h3>
                                    <p className="card-description">
                                        {club.description}
                                    </p>
                                    <div className="card-footer">
                                        <div className="member-pill">
                                            <Users size={14} />
                                            {club._count.memberships} active
                                        </div>
                                        <a href="/coming-soon" className="explore-link">
                                            View Projects <ArrowRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Non-Tech Clubs Section */}
                <div className="section">
                    <div className="section-header">
                        <span className="section-label" style={{ color: "var(--g-yellow)" }}>Design & Community</span>
                        <h2 className="section-title">Creative Tracks</h2>
                    </div>

                    <div className="bento-grid">
                        {creative.map((club, idx) => {
                            const span = 'col-span-4';
                            const isMyClub = club.id === myClubId;
                            const IconCmp = (club.iconType ? iconMap[club.iconType] : null) || PenTool;
                            return (
                                <div key={club.id} className={`bento-card ${span}`} style={{ color: club.colorToken || 'var(--g-yellow)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div className="icon-box">
                                            <IconCmp size={24} style={{ color: club.colorToken || 'var(--g-yellow)' }} />
                                        </div>
                                        {isMyClub && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', fontWeight: 800, color: '#137333', background: '#e6f4ea', padding: '4px 10px', borderRadius: 100 }}>
                                                <CheckCircle2 size={12} /> JOINED
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="card-title">{club.name}</h3>
                                    <p className="card-description">
                                        {club.description}
                                    </p>
                                    <div className="card-footer">
                                        <div className="member-pill">
                                            <Users size={14} />
                                            {club._count.memberships} active
                                        </div>
                                        <a href="/coming-soon" className="explore-link">
                                            View Projects <ArrowRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <p style={{
                    textAlign: 'center', color: '#5F6368',
                    fontSize: '0.9rem', marginTop: 48, fontStyle: 'italic'
                }}>
                    Club assignments are made during the recruitment process.
                    Apply to join GDGoC CUI Wah to be placed in a club.
                </p>

                <a href="/join" style={{
                    display: 'block', textAlign: 'center',
                    color: '#4285F4', fontWeight: 600, marginTop: 8,
                    textDecoration: 'none'
                }}>
                    View Recruitment Status →
                </a>
            </main>
        </div>
    );
}
