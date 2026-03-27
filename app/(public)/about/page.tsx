import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'About | GDGoC CUI Wah',
  description: 'Official Google Developer Group on Campus at COMSATS University Islamabad, Wah Campus.',
};

export default async function AboutPage() {
  // ── DATA FETCHING ──
  let totalEvents = 0;
  let studentsReached = 0;
  let teamsCompeteCount = 60; // Default or specific metric
  let leaderCount = 0;
  let recentEvents: any[] = [];
  let leadership: any[] = [];

  try {
    const [eventsCount, regCount, coreCount, events, specificLeads, otherMembers] = await Promise.all([
      prisma.event.count({ where: { isPublished: true } }),
      prisma.eventRegistration.count(),
      prisma.member.count({ where: { role: { in: ['core', 'admin'] } } }),
      prisma.event.findMany({
        where: { isPublished: true },
        orderBy: { date: 'desc' },
        take: 8
      }),
      prisma.member.findMany({
        where: { 
          OR: [
            { slug: 'kashif-ayub' },
            { slug: 'ubaid' },
            { slug: 'ismail' }
          ]
        },
        take: 3
      }),
      prisma.member.findMany({
        where: { 
          role: { in: ['core', 'admin'] }, 
          isActive: true,
          NOT: {
            slug: { in: ['kashif-ayub', 'ubaid', 'ismail'] }
          }
        },
        take: 6,
        orderBy: { createdAt: 'asc' }
      })
    ]);

    totalEvents = eventsCount;
    studentsReached = Math.max(regCount, 500); 
    leaderCount = coreCount;
    recentEvents = events;
    
    // Combine specifically requested leaders with others
    leadership = [...specificLeads, ...otherMembers];
    
    // Final check for high-fidelity image fallbacks
    leadership = leadership.map(m => {
      if (m.slug === 'ismail' && !m.imageUrl) return { ...m, imageUrl: '/images/team/m_ismail.jpeg' };
      if (m.slug === 'ubaid' && !m.imageUrl) return { ...m, imageUrl: '/images/team/ubaid.png' };
      if (m.slug === 'kashif-ayub' && !m.imageUrl) return { ...m, imageUrl: '/images/team/kashif_ayub.png' };
      return m;
    });
  } catch (error) {
    console.warn('⚠️ Error fetching dynamic data for About page, using fallbacks.', error);
  }

  const getEventClass = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('launch') || t.includes('seminar')) return 'tb';
    if (t.includes('workshop')) return 'tg';
    if (t.includes('competition') || t.includes('hackathon')) return 'tr';
    if (t.includes('bootcamp')) return 'ty';
    if (t.includes('creative') || t.includes('art')) return 'tp';
    return 'tb';
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const memberColors = ['ab', 'ar', 'ay', 'ag', 'ap'];

  return (
    <div className="about-page">
      <style>{`
        :root {
          --blue:    #1a73e8;
          --red:     #ea4335;
          --yellow:  #fbbc04;
          --green:   #34a853;
          --dark:    #202124;
          --mid:     #3c4043;
          --light:   #5f6368;
          --border:  #dadce0;
          --bg:      #fff;
          --bg-alt:  #f8f9fa;
        }

        .about-page {
          font-family: 'Roboto', 'Google Sans', system-ui, -apple-system, sans-serif;
          color: var(--dark);
          background: var(--bg);
          line-height: 1.5;
        }

        /* ── HERO ── */
        .hero-section { background: #f8f9fa; padding: 120px 0 0; overflow: hidden; border-bottom: 1px solid var(--border); }
        .hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 48px; }

        .hero-graphic {
          display: flex; align-items: center; flex-wrap: wrap; gap: 8px;
        }
        .hg-bracket {
          font-family: 'Google Sans', sans-serif; font-weight: 700;
          font-size: clamp(80px, 10vw, 150px); line-height: 1; color: #fbbc04;
        }
        .hg-title {
          font-family: 'Google Sans', sans-serif; font-weight: 700;
          font-size: clamp(44px, 5.5vw, 78px); line-height: 1.05;
          color: var(--dark);
        }
        .hg-right {
          display: flex; align-items: center; gap: 20px; margin-left: 20px;
        }
        .hg-arrow {
          width: 72px; height: 30px; background: var(--green); flex-shrink: 0;
          clip-path: polygon(0 28%, 68% 28%, 68% 0, 100% 50%, 68% 100%, 68% 72%, 0 72%);
        }
        .hg-brand {
          font-family: 'Google Sans', sans-serif; font-size: 18px; color: var(--dark);
          line-height: 1.4;
        }
        .hg-brand small { font-size: 13px; color: var(--light); display: block; font-weight: 400; }
        .hg-shapes {
          display: flex; align-items: center; gap: 10px; margin-top: 8px; margin-left: 48px;
        }
        .hg-circle { width: 48px; height: 48px; border-radius: 50%; background: var(--blue); }
        .hg-circle:nth-child(2) { opacity: .65; }
        .hg-circle:nth-child(3) { opacity: .4; }
        .hg-star { font-size: 44px; color: var(--mid); line-height: 1; font-weight: 300; }

        .hero-desc {
          display: flex; align-items: flex-start; gap: 28px;
          padding: 44px 0 60px; max-width: 780px;
        }
        .hero-desc-arrow {
          width: 60px; height: 26px; flex-shrink: 0; margin-top: 4px;
          background: var(--yellow);
          clip-path: polygon(0 28%, 68% 28%, 68% 0, 100% 50%, 68% 100%, 68% 72%, 0 72%);
        }
        .hero-desc p { font-size: 16px; color: var(--mid); line-height: 1.75; }
        .hero-desc a { color: var(--blue); }

        /* ── STATS ── */
        .stats-band {
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          background: var(--bg-alt); padding: 44px 0;
        }
        .stats-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 48px;
          display: grid; grid-template-columns: repeat(4, 1fr);
        }
        .s-item {
          text-align: center; padding: 0 16px;
          border-right: 1px solid var(--border);
        }
        .s-item:last-child { border-right: none; }
        .s-num {
          font-family: 'Google Sans', sans-serif; font-size: 48px; font-weight: 700;
          color: var(--blue); display: block; line-height: 1;
        }
        .s-lbl { font-size: 13px; color: var(--light); margin-top: 8px; }

        /* ── SECTION SHELL ── */
        .sec { padding: 72px 0; }
        .sec-inner { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
        .sec-title {
          font-family: 'Google Sans', sans-serif;
          font-size: clamp(22px, 2.8vw, 34px); font-weight: 700;
          color: var(--dark); margin-bottom: 36px;
        }

        /* ── ABOUT CARDS ── */
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .about-card { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: white; }
        .about-img {
          height: 200px; display: flex; align-items: center; justify-content: center;
        }
        .about-img.pink  { background: #fce8e6; }
        .about-img.green { background: #e6f4ea; }
        .about-body { padding: 28px 28px 32px; }
        .about-body h3 {
          font-family: 'Google Sans', sans-serif; font-size: 22px; font-weight: 400;
          margin-bottom: 14px; color: var(--dark);
        }
        .about-body p { font-size: 15px; color: var(--mid); line-height: 1.72; }

        /* ── EVENTS SPLIT ── */
        .split { display: grid; grid-template-columns: 1fr 1fr; }
        .split-l {
          background: #000; color: #fff;
          padding: 64px 56px 64px 72px;
          display: flex; flex-direction: column; justify-content: center;
          gap: 24px; position: relative; overflow: hidden;
        }
        .split-l::before {
          content: ''; position: absolute; top: 24px; left: 28px;
          width: 44px; height: 56px;
          border-top: 4px solid var(--blue); border-left: 4px solid var(--blue);
        }
        .split-l::after {
          content: ''; position: absolute; bottom: 24px; right: 28px;
          width: 44px; height: 56px;
          border-bottom: 4px solid var(--blue); border-right: 4px solid var(--blue);
        }
        .split-l h2 {
          font-family: 'Google Sans', sans-serif; font-size: 32px; font-weight: 700;
          line-height: 1.2; color: #fff;
        }
        .split-l p { font-size: 15px; color: #bdc1c6; line-height: 1.72; max-width: 380px; }
        .btn-filled {
          display: inline-flex; width: fit-content;
          background: var(--blue); color: #fff;
          font-family: 'Google Sans', sans-serif; font-size: 14px; font-weight: 500;
          padding: 10px 24px; border-radius: 4px; transition: background .2s;
          text-decoration: none;
        }
        .btn-filled:hover { background: #1558d6; }

        .split-r {
          background: var(--blue);
          display: flex; align-items: center; justify-content: center;
          padding: 36px;
        }
        .mosaic { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; }
        .mc {
          background: #fff; border-radius: 10px;
          padding: 16px; display: flex; flex-direction: column; gap: 6px;
          transition: all 0.2s ease;
        }
        .mc:hover { transform: translateY(-3px); }
        .mtag {
          font-size: 10px; font-weight: 600; letter-spacing: .06em;
          text-transform: uppercase; padding: 2px 8px; border-radius: 10px;
          width: fit-content;
        }
        .tb { background: #e8f0fe; color: var(--blue); }
        .tg { background: #e6f4ea; color: var(--green); }
        .tr { background: #fce8e6; color: var(--red); }
        .ty { background: #fef3cd; color: #b06000; }
        .tp { background: #f3e8fd; color: #7b1fa2; }
        .mc h4 { font-family: 'Google Sans', sans-serif; font-size: 12px; font-weight: 700; color: var(--dark); line-height: 1.3; margin: 0; }
        .mc p  { font-size: 11px; color: var(--light); margin: 0; }

        /* ── LEADER SECTION ── */
        .leader-sec { background: #e8f0fe; padding: 80px 0; }
        .leader-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 48px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
        }
        .leader-l h2 {
          font-family: 'Google Sans', sans-serif; font-size: 28px; font-weight: 700;
          margin-bottom: 18px; color: var(--dark);
        }
        .leader-l p { font-size: 15px; color: var(--mid); line-height: 1.75; margin-bottom: 24px; }
        .leader-l p strong { color: var(--dark); font-weight: 700; }
        .btn-outline {
          display: inline-flex; width: fit-content;
          background: transparent; color: var(--blue);
          border: 1px solid var(--blue); font-family: 'Google Sans', sans-serif;
          font-size: 14px; font-weight: 500; padding: 10px 24px;
          border-radius: 4px; transition: background .2s;
          text-decoration: none;
        }
        .btn-outline:hover { background: rgba(26,115,232,.06); }

        .face-stack { display: flex; align-items: center; margin-left: 12px; }
        .fs-item {
          width: 80px; height: 80px; border-radius: 50%;
          border: 4px solid #fff; margin-left: -24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          overflow: hidden; background: #fff;
          transition: transform 0.3s ease, z-index 0s;
          position: relative; cursor: pointer;
        }
        .fs-item:first-child { margin-left: 0; }
        .fs-item:hover { transform: translateY(-8px); z-index: 10; }
        .fs-img { width: 100%; height: 100%; object-fit: cover; }
        .fs-initial {
          width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
          font-family: 'Google Sans', sans-serif; font-size: 24px; font-weight: 700;
        }
        .fs-more {
          width: 80px; height: 80px; border-radius: 50%;
          background: #f1f3f4; border: 4px solid #fff;
          display: flex; align-items: center; justify-content: center;
          margin-left: -24px; font-family: 'Google Sans', sans-serif; font-size: 20px;
          font-weight: 700; color: var(--light); transition: all 0.3s ease;
          text-decoration: none; position: relative; z-index: 1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
        .fs-more:hover { transform: translateY(-8px); z-index: 10; background: #e8eaed; color: var(--dark); }

        /* ── RESPONSIVE ── */
        @media (max-width: 860px) {
          .about-grid, .split, .leader-inner, .stats-inner { grid-template-columns: 1fr; }
          .split-l { padding: 48px 32px; }
          .mosaic { grid-template-columns: 1fr 1fr; }
          .face-stack { margin-top: 24px; margin-left: 0; transform: scale(0.9); }
          .sec-inner, .leader-inner { padding: 0 24px; }
          .hero-inner { padding: 0 24px; }
          .hg-bracket { font-size: 80px; }
          .hg-right { margin-left: 0; }
          .stats-inner { padding: 0 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
          .s-item { border-right: none; border-bottom: 1px solid var(--border); padding-bottom: 16px; }
          .s-item:nth-child(even) { border-left: 1px solid var(--border); }
        }
      `}</style>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-graphic">
            <div className="hg-bracket">{"{"}</div>
            <div>
              <div className="hg-title">GDGoC</div>
              <div className="hg-title">CUI Wah</div>
            </div>
            <div className="hg-bracket">{"}"}</div>
            <div className="hg-right">
              <div className="hg-arrow"></div>
              <div className="hg-brand">
                <strong>Google for Developers</strong>
                <small>COMSATS University Islamabad<br />Wah Campus</small>
              </div>
            </div>
            <div className="hg-shapes">
              <div className="hg-circle"></div>
              <div className="hg-circle"></div>
              <div className="hg-circle"></div>
              <div className="hg-star">✳</div>
            </div>
          </div>

          <div className="hero-desc">
            <div className="hero-desc-arrow"></div>
            <p>
              GDGoC CUI Wah is the official Google Developer Group on Campus at COMSATS University Islamabad, Wah Campus. We run workshops, bootcamps, seminars, and competitions, empowering students to build real skills in AI, web development, and software engineering. <Link href="/events">Find our next event →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-band">
        <div className="stats-inner">
          <div className="s-item"><span className="s-num">{totalEvents}+</span><div className="s-lbl">Events organized</div></div>
          <div className="s-item"><span className="s-num">{studentsReached}+</span><div className="s-lbl">Students reached</div></div>
          <div className="s-item"><span className="s-num">{teamsCompeteCount}+</span><div className="s-lbl">Teams competed</div></div>
          <div className="s-item"><span className="s-num">{leaderCount}+</span><div className="s-lbl">Leadership members</div></div>
        </div>
      </div>

      {/* ABOUT */}
      <section className="sec">
        <div className="sec-inner">
          <h2 className="sec-title">About the chapter</h2>
          <div className="about-grid">

            <div className="about-card">
              <div className="about-img pink">
                <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
                  <rect x="20" y="55" width="14" height="32" rx="3" fill="#ea4335" />
                  <rect x="48" y="40" width="14" height="47" rx="3" fill="#fbbc04" />
                  <rect x="76" y="25" width="14" height="62" rx="3" fill="#34a853" />
                  <circle cx="27" cy="44" r="10" fill="#ea4335" />
                  <circle cx="55" cy="29" r="10" fill="#fbbc04" />
                  <circle cx="83" cy="14" r="10" fill="#34a853" />
                </svg>
              </div>
              <div className="about-body">
                <h3>Our Mission</h3>
                <p>GDGoC CUI Wah builds a thriving developer community on campus, empowering students with technical skills, industry exposure, and a collaborative mindset. We bridge academic learning with real-world development through workshops, bootcamps, and competitions.</p>
              </div>
            </div>

            <div className="about-card">
              <div className="about-img green">
                <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
                  <circle cx="55" cy="55" r="34" stroke="#34a853" strokeWidth="3" fill="none" />
                  <ellipse cx="55" cy="55" rx="18" ry="34" stroke="#34a853" strokeWidth="2" fill="none" />
                  <line x1="21" y1="55" x2="89" y2="55" stroke="#34a853" strokeWidth="2" />
                  <line x1="25" y1="40" x2="85" y2="40" stroke="#34a853" strokeWidth="1.5" />
                  <line x1="25" y1="70" x2="85" y2="70" stroke="#34a853" strokeWidth="1.5" />
                  <rect x="40" y="48" width="30" height="14" rx="4" fill="#34a853" />
                  <text x="47" y="59" fontFamily="monospace" fontSize="9" fill="#fff">{"</>"}</text>
                </svg>
              </div>
              <div className="about-body">
                <h3>GDG On Campus</h3>
                <p>GDGs on Campus provide learning opportunities for aspiring developers from universities around the world, helping them gain hands-on experience and build a strong foundation for a tech career. After graduating, members seamlessly transition to the broader GDG community.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* EVENTS SPLIT */}
      <section className="split" id="events">
        <div className="split-l">
          <h2>Event Highlights</h2>
          <p>From AI bootcamps and on-spot programming competitions to web dev workshops and creative art challenges — we pack our calendar with community-led events for students.</p>
          <Link className="btn-filled" href="/events">See all events</Link>
        </div>
        <div className="split-r">
          <div className="mosaic">
            {recentEvents.length > 0 ? recentEvents.map((ev, i) => (
              <Link href={`/events/${ev.slug}`} key={ev.id} className="mc" style={{ color: 'inherit', textDecoration: 'none' }}>
                <span className={`mtag ${getEventClass(ev.type)}`}>{ev.type}</span>
                <h4>{ev.title}</h4>
                <p>{new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </Link>
            )) : (
              [1, 2, 3, 4, 5, 6, 7, 8].map(n => <div key={n} className="mc"><h4 style={{ margin: 0 }}>Upcoming Event</h4></div>)
            )}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="leader-sec" id="team">
        <div className="leader-inner">
          <div className="leader-l">
            <h2>Meet the leadership team</h2>
            <p>GDGoC CUI Wah is run by passionate student leaders across AI, web development, programming, and community management — <strong>{leaderCount}+ dedicated members</strong> who organize every event and initiative on campus.</p>
            <Link className="btn-outline" href="/team">Get involved →</Link>
          </div>
          <div className="face-stack">
            {leadership.map((lead, i) => (
              <Link href={`/team/${lead.slug}`} key={lead.id} className="fs-item" title={lead.name}>
                {lead.imageUrl ? (
                  <img src={lead.imageUrl} alt={lead.name} className="fs-img" />
                ) : (
                  <div className={`fs-initial ${memberColors[i % memberColors.length]}`}>
                    {getInitials(lead.name)}
                  </div>
                )}
              </Link>
            ))}
            {leaderCount > leadership.length ? (
              <Link href="/team" className="fs-more">
                +{leaderCount - leadership.length}
              </Link>
            ) : (
              <Link href="/team" className="fs-more">
                +
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
