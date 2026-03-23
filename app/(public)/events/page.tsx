import React, { Suspense } from 'react';
import EventsPageContent from './EventsPageContent';
import { EventSummary } from '@/types/event';
import { prisma } from '@/lib/prisma';

async function getEvents(params?: {
  search?: string
  type?:   string
  topic?:  string
  date?:   string
  page?:   number
}) {
  const baseUrl = process.env.AUTH_URL ?? 'http://localhost:3000';
  const url = new URL('/api/events', baseUrl);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.type)   url.searchParams.set('type',   params.type);
  if (params?.topic)  url.searchParams.set('topic',  params.topic);
  if (params?.date)   url.searchParams.set('date',   params.date);
  if (params?.page)   url.searchParams.set('page',   String(params.page));

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json() as Promise<{ events: EventSummary[], total: number, page: number, pages: number }>;
}

async function getMeta() {
  const baseUrl = process.env.AUTH_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/events/meta`, { cache: 'no-store' });
  if (!res.ok) return { types: [], topics: [] };
  return res.json() as Promise<{ types: string[], topics: string[] }>;
}

/** Fetch ALL published events (unpaginated) so the calendar can mark every date. */
async function getAllEvents() {
  const baseUrl = process.env.AUTH_URL ?? 'http://localhost:3000';
  const url = new URL('/api/events', baseUrl);
  url.searchParams.set('limit', '200'); // generous upper bound
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) return [] as EventSummary[];
  const data = await res.json();
  return data.events as EventSummary[];
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string; topic?: string; date?: string; page?: string }>
}) {
  const sp = await searchParams;

  const [data, meta, allEvents, upcomingCount] = await Promise.all([
    getEvents({
      search: sp.search,
      type:   sp.type,
      topic:  sp.topic,
      date:   sp.date,
      page:   sp.page ? Number(sp.page) : 1,
    }),
    getMeta(),
    getAllEvents(),
    prisma.event.count({
      where: { isPublished: true, date: { gte: new Date() } },
    }),
  ]);

  return (
    <div className="events-root">
      <style>{`
        .events-root { color: #3c4043; font-family: 'Google Sans Text', 'Roboto', sans-serif; -webkit-font-smoothing: antialiased; min-height: 100vh; }
        
        /* --- THE UNIFIED HERO COMPONENT --- */
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
            background: radial-gradient(circle, rgba(234, 67, 53, 0.15) 0%, transparent 70%);
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
            color: #5f6368;
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
            color: #202124;
            letter-spacing: -0.02em;
        }

        .hero-title span { 
            color: #EA4335;
        }

        .hero-subtitle {
            font-size: 1.15rem;
            color: #5f6368;
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
            color: #5f6368;
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

        .main-container { max-width: 1140px; margin: 0 auto; padding: 60px 20px; }

        .view-switcher { display: flex; justify-content: flex-end; gap: 24px; margin-bottom: 32px; border-bottom: 1px solid #dadce0; }
        .view-tab { font-size: 16px; font-weight: 500; color: #5f6368; cursor: pointer; padding: 12px 0; position: relative; transition: color 0.2s; }
        .view-tab:hover { color: #202124; }
        .view-tab.active { color: #1a73e8; }
        .view-tab.active::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: #1a73e8; border-radius: 3px 3px 0 0; }

        .filter-bar { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; margin-bottom: 16px; align-items: center; }
        
        .search-wrapper { position: relative; border: 1px solid #dadce0; border-radius: 4px; display: flex; align-items: center; padding: 0 16px; height: 48px; background: white; }
        .search-wrapper input { border: none; outline: none; flex: 1; font-size: 16px; color: #202124; font-family: inherit; }
        .search-wrapper input::placeholder { color: #9aa0a6; }
        .search-btn { color: #5f6368; background: none; border: none; cursor: pointer; padding: 0; }

        .filter-select { height: 48px; border: 1px solid #dadce0; border-radius: 4px; padding: 0 16px; min-width: 180px; display: flex; align-items: center; justify-content: space-between; font-size: 16px; color: #5f6368; background: white; cursor: pointer; }

        /* Event Card Styles */
        .event-card { display: flex; gap: 40px; margin-bottom: 60px; transition: all 0.3s; }
        .event-badge-wrapper { flex-shrink: 0; }
        .badge-outer { width: 140px; height: 140px; background: #f8f9fa; border: 1px solid #f1f3f4; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 10px rgba(0,0,0,0.02); }
        .badge-image { width: 90px; height: 90px; object-fit: contain; }

        .event-content { flex: 1; }
        .event-meta { font-size: 12px; font-weight: 700; color: #5f6368; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; letter-spacing: 0.5px; }
        .meta-sep { color: #dadce0; }
        .meta-loc { color: #1a73e8; }
        .event-title { font-size: 28px; font-weight: 500; color: #202124; margin: 0 0 16px 0; line-height: 1.2; letter-spacing: -0.3px; }
        
        .tag-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .event-tag { background: #f1f3f4; color: #5f6368; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        
        .event-desc { font-size: 15px; line-height: 1.6; color: #3c4043; margin-bottom: 24px; max-width: 850px; }
        .details-btn { background: #1a73e8; color: white; border: none; padding: 10px 24px; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s; }
        .details-btn:hover { background: #1557b0; }

        /* Calendar */
        .cal-container { border: 1px solid #dadce0; border-radius: 8px; overflow: hidden; background: white; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .cal-header { padding: 20px; border-bottom: 1px solid #dadce0; display: flex; justify-content: space-between; align-items: center; }
        .cal-month-nav { display: flex; align-items: center; gap: 16px; }
        .cal-month-nav h3 { margin: 0; min-width: 140px; text-align: center; font-size: 18px; font-weight: 500; }
        .icon-btn { background: none; border: none; cursor: pointer; color: #5f6368; display: flex; padding: 8px; border-radius: 50%; transition: background 0.2s; }
        .icon-btn:hover { background: #f1f3f4; color: #202124; }
        .cal-today-btn { padding: 8px 16px; border: 1px solid #dadce0; background: white; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .cal-today-btn:hover { background: #f8f9fa; border-color: #bdc1c6; }

        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); background: #dadce0; gap: 1px; }
        .cal-weekday { background: #f8f9fa; padding: 12px; text-align: center; font-size: 11px; font-weight: 700; color: #70757a; text-transform: uppercase; letter-spacing: 0.8px; }
        .cal-day { background: white; height: 110px; padding: 10px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.2s; }
        .cal-day:hover:not(.empty) { background: #f8f9fa; }
        .cal-day.empty { background: #fafafa; cursor: default; }
        .cal-day.active { box-shadow: inset 0 0 0 2px #1a73e8; background: #e8f0fe; z-index: 1; }
        .cal-day.has-ev { font-weight: bold; }
        .day-num { font-size: 12px; font-weight: 500; color: #70757a; align-self: flex-start; }
        .active .day-num { color: #1a73e8; font-weight: 700; }
        .dot-box { display: flex; gap: 3px; justify-content: center; padding-bottom: 4px; }
        .ev-dot { width: 6px; height: 6px; border-radius: 50%; }

        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 768px) {
          .events-root { padding: 40px 16px; }
          .event-card { flex-direction: column; gap: 24px; text-align: center; margin-bottom: 48px; }
          .badge-outer { width: 120px; height: 120px; margin: 0 auto; }
          .badge-image { width: 80px; height: 80px; }
          .event-meta, .tag-list { justify-content: center; flex-wrap: wrap; }
          .event-title { font-size: 24px; }
          .hero-title { font-size: 32px; }
          .filter-bar { grid-template-columns: 1fr; }
          .cal-day { height: 80px; padding: 6px; }
          .cal-month-nav h3 { min-width: 110px; font-size: 16px; }
        }
      `}</style>

      <header className="hero" data-aos="fade-up">
        <div className="hero-content">
          <nav className="hero-breadcrumb">
            <span>GDGOC</span> <span className="dot-sep" /> <span style={{ color: "#EA4335" }}>Events</span>
          </nav>
          <h1 className="hero-title">Connect, Learn, and <span>Grow</span> together.</h1>
          <p className="hero-subtitle">From hands-on workshops to global hackathons, stay up to date with the latest gatherings in our chapter.</p>
          <div className="hero-meta">
            <div className="meta-item"><span className="meta-dot" style={{ background: "#EA4335" }} /> {upcomingCount} Upcoming Events</div>
            <div className="meta-item"><span className="meta-dot" style={{ background: "#34A853" }} /> {data.total} Matching</div>
          </div>
        </div>
      </header>

      <div className="main-container">
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px 0' }}>Loading…</div>}>
          <EventsPageContent
            events={data.events}
            total={data.total}
            page={data.page}
            pages={data.pages}
            meta={meta}
            allEvents={allEvents}
          />
        </Suspense>
      </div>
    </div>
  );
}
