import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  Users, 
  Zap,
  Globe,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { EventDetail } from '@/types/event';
import RSVPButton from '@/components/Events/RSVPButton';

async function getEvent(slug: string): Promise<EventDetail> {
  const baseUrl = process.env.AUTH_URL ?? 'http://localhost:3000';
  const res = await fetch(
    `${baseUrl}/api/events/${slug}`,
    { cache: 'no-store' }
  );
  if (!res.ok) notFound();
  return res.json();
}

export async function generateStaticParams() {
  try {
    const events = await prisma.event.findMany({
      where:  { isPublished: true },
      select: { slug: true },
    });
    return events.map(e => ({ slug: e.slug }));
  } catch (error) {
    console.warn('Could not fetch events for static generation during build:', error);
    return [];
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const event = await getEvent(slug);

    const dateObj = new Date(event.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const year = dateObj.getFullYear();

    return (
        <div className="event-detail-root">
            <style>{`
                :root {
                    --g-blue: #4285F4;
                    --g-red: #EA4335;
                    --g-yellow: #FBBC04;
                    --g-green: #34A853;
                    --g-text-main: #202124;
                    --g-text-sub: #5F6368;
                    --g-border: #dadce0;
                    --section-gap: 4rem;
                }

                .event-detail-root {
                    font-family: 'Google Sans Text', sans-serif;
                    color: var(--g-text-main);
                    background: #fff;
                    min-height: 100vh;
                    -webkit-font-smoothing: antialiased;
                }

                .event-hero {
                    position: relative;
                    height: 500px;
                    display: flex;
                    align-items: flex-end;
                    padding: 4rem 1.5rem;
                    background: #202124;
                    overflow: hidden;
                    color: white;
                }

                .hero-bg-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.4;
                    mix-blend-mode: luminosity;
                }

                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
                    z-index: 1;
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                    max-width: 1000px;
                    margin: 0 auto;
                    width: 100%;
                }

                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: rgba(255,255,255,0.9);
                    text-decoration: none;
                    font-size: 0.9rem;
                    margin-bottom: 2rem;
                    font-weight: 500;
                    transition: transform 0.2s;
                }

                .back-link:hover { transform: translateX(-4px); color: #fff; }

                .hero-content-inner {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .event-tag {
                    display: inline-block;
                    width: fit-content;
                    padding: 4px 12px;
                    background: rgba(255,255,255,0.2);
                    backdrop-filter: blur(4px);
                    border-radius: 100px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .event-title {
                    font-family: 'Product Sans', sans-serif;
                    font-size: clamp(2.5rem, 6vw, 4rem);
                    line-height: 1.1;
                    margin-bottom: 1.5rem;
                    letter-spacing: -0.02em;
                    color: white;
                }

                .main-layout {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 4rem 1.5rem;
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 4rem;
                }

                .section-title {
                    font-family: 'Product Sans', sans-serif;
                    font-size: 1.75rem;
                    margin-bottom: 1.5rem;
                    color: var(--g-text-main);
                }

                .about-text {
                    font-size: 1.1rem;
                    line-height: 1.7;
                    color: var(--g-text-main);
                    margin-bottom: 3rem;
                }

                /* Agenda Styles */
                .agenda-item {
                    display: grid;
                    grid-template-columns: 100px 1fr;
                    gap: 24px;
                    padding: 1.5rem 0;
                    border-bottom: 1px solid var(--g-border);
                }

                .agenda-time {
                    font-weight: 700;
                    color: var(--g-blue);
                }

                .agenda-content h4 {
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                }

                .agenda-content p {
                    color: var(--g-text-sub);
                    font-size: 0.95rem;
                }

                /* Sidebar Styles */
                .event-sidebar {
                    position: sticky;
                    top: 2rem;
                    height: fit-content;
                }

                .action-card {
                    background: #f8f9fa;
                    border-radius: 24px;
                    padding: 24px;
                    margin-bottom: 2rem;
                }

                .register-btn {
                    width: 100%;
                    padding: 16px;
                    background: var(--g-blue);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    margin-bottom: 1rem;
                    transition: filter 0.2s;
                }

                .register-btn:hover { filter: brightness(1.1); }

                .meta-list {
                    list-style: none;
                }

                .meta-row {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 1.25rem;
                }

                .meta-icon {
                    width: 40px;
                    height: 40px;
                    background: #fff;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--g-blue);
                    flex-shrink: 0;
                }

                .meta-text h5 {
                    font-size: 0.8rem;
                    color: var(--g-text-sub);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 2px;
                }

                .meta-text p {
                    font-weight: 500;
                }

                .badges-section {
                    margin-top: 2rem;
                }

                .badge-preview {
                    width: 120px;
                    height: 120px;
                    margin: 1.5rem auto;
                    background: #fff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }

                .badge-img {
                    width: 80px;
                    height: 80px;
                    object-fit: contain;
                }

                @media (max-width: 850px) {
                    .main-layout { grid-template-columns: 1fr; gap: 3rem; }
                    .event-hero { height: 400px; }
                    .agenda-item { grid-template-columns: 80px 1fr; }
                }
            `}</style>

            <header className="event-hero">
                {event.imageUrl && <img src={event.imageUrl} alt="" className="hero-bg-image" />}
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <Link href="/events" className="back-link">
                        <ArrowLeft size={18} /> Back to all events
                    </Link>
                    <div className="hero-content-inner">
                        <div className="event-tag">{event.type}</div>
                        <h1 className="event-title">{event.title}</h1>
                    </div>
                </div>
            </header>

            <main className="main-layout">
                <div className="content-area">
                    <section>
                        <h2 className="section-title">About this event</h2>
                        <div className="about-text">
                            <p>{event.description}</p>
                            <br />
                            <p>Join our community for a deep dive into {event.type.toLowerCase()}. This session is designed for both beginners and experienced developers. We'll cover emerging trends, best practices, and hands-on implementation details to help you build better tech.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="section-title">Agenda</h2>
                        <div className="agenda-list">
                            {event.agendaItems.map((item) => (
                                <div key={item.id} className="agenda-item">
                                    <div className="agenda-time">{item.time}</div>
                                    <div className="agenda-content">
                                        <h4>{item.title}</h4>
                                        <p>{item.description}</p>
                                        {item.speaker && (
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                                <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: '#e8f0fe', color: '#1a73e8', borderRadius: '4px', fontWeight: 'bold' }}>{item.speaker.toUpperCase()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {event.agendaItems.length === 0 && (
                                <p style={{ color: 'var(--g-text-sub)' }}>No agenda items announced yet.</p>
                            )}
                        </div>
                    </section>

                    <section style={{ marginTop: '4rem' }}>
                        <h2 className="section-title">What you'll earn</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <div style={{ padding: '20px', border: '1px solid var(--g-border)', borderRadius: '16px' }}>
                                <Zap color="var(--g-yellow)" style={{ marginBottom: '12px' }} />
                                <h4 style={{ marginBottom: '8px' }}>Expert Insights</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--g-text-sub)' }}>Direct learning from community leads and experts.</p>
                            </div>
                            <div style={{ padding: '20px', border: '1px solid var(--g-border)', borderRadius: '16px' }}>
                                <Users color="var(--g-blue)" style={{ marginBottom: '12px' }} />
                                <h4 style={{ marginBottom: '8px' }}>Network</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--g-text-sub)' }}>Connect with {event._count.registrations}+ local developers in your niche.</p>
                            </div>
                        </div>
                    </section>
                </div>

                <aside className="event-sidebar">
                    <div className="action-card">
                        <RSVPButton slug={event.slug} />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>

                            <button style={{ flex: 1, padding: '10px', background: 'white', border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <Share2 size={16} /> Share
                            </button>
                            <button style={{ flex: 1, padding: '10px', background: 'white', border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <Bookmark size={16} /> Save
                            </button>
                        </div>
                    </div>

                    <div className="meta-list">
                        <div className="meta-row">
                            <div className="meta-icon"><Calendar size={20} /></div>
                            <div className="meta-text">
                                <h5>Date</h5>
                                <p>{formattedDate}, {year}</p>
                            </div>
                        </div>
                        <div className="meta-row">
                            <div className="meta-icon"><Clock size={20} /></div>
                            <div className="meta-text">
                                <h5>Time</h5>
                                <p>10:00 AM — 04:30 PM</p>
                            </div>
                        </div>
                        <div className="meta-row">
                            <div className="meta-icon"><MapPin size={20} /></div>
                            <div className="meta-text">
                                <h5>Location</h5>
                                <p>{event.location}</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
