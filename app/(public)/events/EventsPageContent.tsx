'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { EventSummary } from '@/types/event';
import { EventSearch } from '@/components/Events/EventSearch';
import { EventFilters } from '@/components/Events/EventFilters';
import { ActiveFilters } from '@/components/Events/ActiveFilters';
import { Pagination } from '@/components/Events/Pagination';

// ─── Event List Item ────────────────────────────────────────────────────────

const EventListItem = ({ title, slug, date, location, tags, description, badgeUrl, imageUrl, _count }: EventSummary) => {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  const year = dateObj.getFullYear();

  return (
    <div className="event-card animate-fade-in">
      <div className="event-badge-wrapper">
        <div className="badge-outer">
          <img
            src={imageUrl || badgeUrl || "https://fonts.gstatic.com/s/i/productlogos/googleg_standard/v9/64.png"}
            alt={title}
            className="badge-image"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              (e.target as HTMLImageElement).src = 'https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png';
            }}
          />
        </div>
      </div>
      <div className="event-content">
        <div className="event-meta">
          <span className="meta-date">{formattedDate}, {year}</span>
          <span className="meta-sep">—</span>
          <span className="meta-type">WORKSHOP / STUDY GROUP</span>
          <span className="meta-sep">—</span>
          <span className="meta-loc">{location.toUpperCase()}</span>
          {dateObj < new Date() && (
            <span style={{ 
              marginLeft: 'auto', 
              background: '#f8f9fa', 
              color: '#5f6368', 
              padding: '2px 10px', 
              borderRadius: 100, 
              fontSize: '11px', 
              border: '1px solid #dadce0',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>Past Event</span>
          )}
        </div>
        <h2 className="event-title">{title}</h2>
        <div className="tag-list">
          {tags.map((t, idx) => (
            <span key={idx} className="event-tag">{t.tag}</span>
          ))}
        </div>
        <p className="event-desc">{description}</p>

        {_count?.registrations > 0 && (
          <div style={{
            fontSize: '0.85rem',
            color: '#5F6368',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '1.5rem',
            fontWeight: 500
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34A853' }} />
            {_count.registrations} registered
          </div>
        )}

        <Link href={`/events/${slug}`}>
          <button className="details-btn">View details</button>
        </Link>
      </div>
    </div>
  );
};

// ─── Calendar View (URL-driven) ─────────────────────────────────────────────

const CalendarView = ({ allEvents }: { allEvents: EventSummary[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const selectedDate = searchParams.get('date') ?? '';

  // Build a set for O(1) lookup
  const eventDates = new Set(
    allEvents.map(e => {
      const d = new Date(e.date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })
  );

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = new Date(viewYear, viewMonth).toLocaleString('en-PK', {
    month: 'long', year: 'numeric',
  });

  function changeMonth(offset: number) {
    const d = new Date(viewYear, viewMonth + offset, 1);
    setViewMonth(d.getMonth());
    setViewYear(d.getFullYear());
  }

  function selectDate(day: number) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const params = new URLSearchParams(searchParams.toString());
    if (selectedDate === dateStr) {
      // toggle off if clicking same date
      params.delete('date');
    } else {
      params.set('date', dateStr);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="cal-container animate-fade-in">
      {/* Header */}
      <div className="cal-header">
        <div className="cal-month-nav">
          <button className="icon-btn" onClick={() => changeMonth(-1)}>
            <ChevronLeft size={20} />
          </button>
          <h3>{monthLabel}</h3>
          <button className="icon-btn" onClick={() => changeMonth(1)}>
            <ChevronRight size={20} />
          </button>
        </div>
        <button
          className="cal-today-btn"
          onClick={() => { setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); }}
        >
          Today
        </button>
      </div>

      {/* Grid */}
      <div className="cal-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="cal-weekday">{d}</div>
        ))}

        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="cal-day empty" />;

          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const hasEvent = eventDates.has(dateStr);
          const isToday = dateStr === todayStr;
          const isSelected = selectedDate === dateStr;

          return (
            <div
              key={day}
              className={`cal-day ${hasEvent ? 'has-ev' : ''} ${isSelected ? 'active' : ''}`}
              onClick={() => hasEvent && selectDate(day)}
              style={{ cursor: hasEvent ? 'pointer' : 'default' }}
              title={hasEvent ? 'Click to filter events for this date' : undefined}
            >
              <span className="day-num" style={{
                color: isSelected ? '#1a73e8' : isToday ? '#EA4335' : '#70757a',
                fontWeight: isToday || isSelected ? 700 : 500,
              }}>
                {day}
              </span>
              <div className="dot-box">
                {hasEvent && (
                  <div
                    className="ev-dot"
                    style={{ backgroundColor: isSelected ? '#1a73e8' : '#4285F4' }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Page Content (client shell) ───────────────────────────────────────

const EventsPageContent = ({
  events,
  total,
  page,
  pages,
  meta,
  allEvents,
}: {
  events: EventSummary[]
  total: number
  page: number
  pages: number
  meta: { types: string[]; topics: string[] }
  allEvents: EventSummary[]
}) => {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  return (
    <div className="events-root">
      {/* View switcher */}
      <nav className="view-switcher animate-fade-in">
        <div
          className={`view-tab ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          List
        </div>
        <div
          className={`view-tab ${viewMode === 'calendar' ? 'active' : ''}`}
          onClick={() => setViewMode('calendar')}
        >
          Calendar
        </div>
      </nav>

      {/* Filter bar */}
      <div className="filter-bar animate-fade-in">
        <Suspense fallback={null}>
          <EventSearch />
        </Suspense>
        <Suspense fallback={null}>
          <EventFilters types={meta.types} topics={meta.topics} />
        </Suspense>
      </div>

      {/* Active filter chips */}
      <Suspense fallback={null}>
        <ActiveFilters />
      </Suspense>

      {/* Calendar view */}
      {viewMode === 'calendar' && (
        <Suspense fallback={<div style={{ textAlign: 'center', padding: 40, color: '#5f6368' }}>Loading calendar…</div>}>
          <CalendarView allEvents={allEvents} />
          {/* Show filtered events below the calendar when a date is selected */}
          {searchParams.get('date') && (
            <div className="event-list animate-fade-in" style={{ marginTop: 40 }}>
              <p style={{ fontSize: '0.9rem', color: '#5F6368', marginBottom: 24 }}>
                Showing {events.length} of {total} events
              </p>
              {events.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#5f6368' }}>
                  <p>No events on this date.</p>
                </div>
              ) : (
                events.map(ev => <EventListItem key={ev.slug} {...ev} />)
              )}
            </div>
          )}
        </Suspense>
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <div className="animate-fade-in">
          {/* Result count */}
          <p style={{ fontSize: '0.9rem', color: '#5F6368', marginBottom: 24 }}>
            Showing {events.length} of {total} event{total !== 1 ? 's' : ''}
          </p>

          <div className="event-list">
            {(() => {
              const now = new Date();
              const upcoming = events.filter(e => new Date(e.date) >= now);
              const past = events.filter(e => new Date(e.date) < now);

              return (
                <>
                  {upcoming.length > 0 && (
                    <div className="section-group animate-fade-in" style={{ marginBottom: 48 }}>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#202124', marginBottom: 32, borderLeft: '4px solid #34A853', paddingLeft: 16 }}>Upcoming Events</h2>
                      {upcoming.map(ev => (
                        <EventListItem key={ev.slug} {...ev} />
                      ))}
                    </div>
                  )}

                  {past.length > 0 && (
                    <div className="section-group animate-fade-in">
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#5f6368', marginBottom: 32, borderLeft: '4px solid #dadce0', paddingLeft: 16 }}>Past Events</h2>
                      <div style={{ opacity: 0.85 }}>
                        {past.map(ev => (
                          <EventListItem key={ev.slug} {...ev} />
                        ))}
                      </div>
                    </div>
                  )}

                  {events.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: '#5f6368' }}>
                      <p>No events found matching your filters.</p>
                      <Link
                        href="/events"
                        className="details-btn"
                        style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}
                      >
                        Clear all filters
                      </Link>
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          {/* Pagination */}
          <Suspense fallback={null}>
            <Pagination currentPage={page} totalPages={pages} />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default EventsPageContent;
