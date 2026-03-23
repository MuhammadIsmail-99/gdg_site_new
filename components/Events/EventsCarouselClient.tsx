"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { EventSummary } from '@/types/event';

const EventCard = React.memo(({ event, isActive, onClick, color }: { event: EventSummary; isActive: boolean; onClick: () => void; color: string }) => {
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div
      onClick={onClick}
      className={`card ${isActive ? 'active' : ''}`}
    >
      <div 
        className="card-bg"
        style={{ backgroundImage: `url(${event.imageUrl})` }}
      >
        <div className="card-overlay" style={{ background: color || '#4285F4' }} />
        <div className="card-gradient" />
      </div>

      <div className="card-content">
        <div className="tag-wrapper">
           <span className="tag-badge">
             {event.tags[0]?.tag || event.type}
           </span>
        </div>
        <h2 className="card-title">
          {event.title}
        </h2>
        
        <div className="meta-grid">
          <div className="meta-item">
            <div className="icon-container">
                <Calendar size={18} />
            </div>
            <span className="meta-text">{formattedDate}</span>
          </div>
          <div className="meta-item">
            <div className="icon-container">
                <MapPin size={18} />
            </div>
            <span className="meta-text">{event.location}</span>
          </div>
        </div>
        
        <p className="card-description">
          {event.description}
        </p>
        
        <Link href={`/events/${event.slug}`} onClick={(e) => e.stopPropagation()}>
          <button className="register-btn">
            Register Now
            <ExternalLink size={18} />
          </button>
        </Link>
      </div>

      <div className="collapsed-tag">
        <h3 className="vertical-text">
          {event.tags[0]?.tag || event.type}
        </h3>
      </div>
      
    </div>
  );
});

EventCard.displayName = "EventCard";

export default function EventsCarouselClient({ events }: { events: EventSummary[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335'];

  useEffect(() => {
    let lastIndex = -1;
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      if (rect.top > viewportHeight || rect.bottom < 0) return;
      
      const scrollableDistance = rect.height - viewportHeight;
      if (scrollableDistance <= 0) return;
      
      const rawProgress = -rect.top / scrollableDistance;
      const progress = Math.max(0, Math.min(1, rawProgress));
      
      let index = Math.floor(progress * events.length);
      if (progress > 0.95) index = events.length - 1;
      else if (index >= events.length) index = events.length - 1;
      
      if (index !== lastIndex) {
        lastIndex = index;
        setActiveIndex(index);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [events.length]);

  const handleNavClick = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const viewportHeight = window.innerHeight;
    const scrollableDistance = container.offsetHeight - viewportHeight;
    const segmentSize = scrollableDistance / events.length;
    
    const targetScroll = container.offsetTop + (index * segmentSize) + (segmentSize / 2);
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  if (events.length === 0) return null;

  return (
    <div ref={scrollContainerRef} className="scroll-wrapper" data-aos="fade-up">
      <div className="app-container">
        <style>{`
          :root {
            --google-blue: #4285F4;
            --google-red: #EA4335;
            --google-yellow: #FBBC05;
            --google-green: #34A853;
            --text-primary: #202124;
            --text-secondary: #5F6368;
            --gray-light: #F8F9FA;
            --border-color: #E0E0E0;
          }

          .scroll-wrapper {
            position: relative;
            height: 200vh;
            background-color: white;
            margin-top: 40px;
          }

          .app-container {
            position: sticky;
            top: 0;
            background-color: white;
            min-height: 70vh;
            font-family: 'Google Sans', 'Roboto', sans-serif;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 0;
            box-sizing: border-box;
          }

          .main-wrapper {
            max-width: 1400px;
            width: 100%;
            padding: 0 80px;
          }

          .header-controls {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-bottom: 32px;
            gap: 24px;
          }

          @media (min-width: 768px) {
            .header-controls {
              flex-direction: row;
              align-items: flex-end;
            }
          }

          .main-title {
            font-size: 36px;
            font-weight: 900;
            color: var(--text-primary);
            letter-spacing: -0.05em;
            margin-bottom: 16px;
            margin-top: 0;
          }

          .main-description {
            color: var(--text-secondary);
            font-size: 18px;
            font-weight: 300;
            line-height: 1.5;
            max-width: 600px;
            margin: 0;
          }

          .controls-group {
            display: flex;
            align-items: center;
            gap: 32px;
          }

          .pagination-container {
            display: flex;
            gap: 12px;
            align-items: center;
          }

          .page-btn {
            height: 10px;
            border-radius: 9999px;
            border: none;
            cursor: pointer;
            transition: all 0.5s;
            padding: 0;
          }

          .arrows-container {
            display: flex;
            gap: 12px;
          }

          .arrow-btn {
            padding: 16px;
            background: white;
            border: 2px solid #F1F3F4;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .arrow-btn:hover:not(:disabled) {
            border-color: var(--google-blue);
            color: var(--google-blue);
          }

          .arrow-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }

          .carousel-grid {
            display: flex;
            gap: 20px;
            width: 100%;
            align-items: stretch;
          }

          /* Card Styles */
          .card {
            position: relative;
            height: 400px;
            cursor: pointer;
            overflow: hidden;
            border-radius: 40px;
            transition: all 1s cubic-bezier(0.2, 1, 0.2, 1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            flex: 0 0 8%;
            opacity: 0.4;
            min-height: 0;
          }

          .card.active {
            flex: 0 0 70%;
            opacity: 1;
            cursor: default;
          }

          .card:hover:not(.active) {
            opacity: 1;
          }

          .card-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            transition: transform 2s;
          }

          .card-overlay {
            position: absolute;
            inset: 0;
            mix-blend-mode: multiply;
            opacity: 0.6;
          }

          .card-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, black, rgba(0,0,0,0.3) 40%, transparent);
          }

          .card-content {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 40px;
            transition: all 0.7s 0.1s;
          }

          .card:not(.active) .card-content {
            opacity: 0;
            transform: translateY(40px);
            pointer-events: none;
          }

          .tag-badge {
            display: inline-block;
            padding: 6px 16px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            background: white;
            color: var(--text-primary);
            border-radius: 9999px;
            margin-bottom: 20px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }

          .card-title {
            font-size: 48px;
            font-weight: 900;
            color: white;
            margin-bottom: 24px;
            line-height: 1.1;
            letter-spacing: -0.04em;
          }

          .meta-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 24px;
            margin-bottom: 24px;
          }

          .meta-item {
            display: flex;
            align-items: center;
            gap: 10px;
            color: white;
          }

          .icon-container {
            padding: 8px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            backdrop-filter: blur(20px);
            display: flex;
          }

          .meta-text {
            font-size: 16px;
            font-weight: 600;
          }

          .card-description {
            max-width: 650px;
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            line-height: 1.5;
            font-weight: 300;
            margin-bottom: 32px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .register-btn {
            width: fit-content;
            display: flex;
            align-items: center;
            gap: 10px;
            background: white;
            color: var(--text-primary);
            padding: 16px 36px;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 16px;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
          }

          .register-btn:hover {
            transform: translateY(-4px);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
          }

          .collapsed-tag {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.7s;
          }

          .card.active .collapsed-tag {
            opacity: 0;
            pointer-events: none;
          }

          .vertical-text {
            white-space: nowrap;
            font-weight: 900;
            color: white;
            font-size: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5em;
            transform: rotate(-90deg);
          }


          .header-label {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
          }

          .dots-row {
            display: flex;
            gap: 6px;
          }

          .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
          }

          @media (max-width: 768px) {
            .app-container {
              height: 100vh;
              min-height: 550px;
              padding: 40px 0;
              position: sticky;
              top: 0;
            }
            .carousel-grid {
              flex-direction: column;
              height: 420px;
            }
            .card {
              flex: 0 0 10%;
              width: 100%;
              border-radius: 20px;
            }
            .card.active {
              flex: 0 0 65%;
            }
            .collapsed-tag, .vertical-text {
              display: none;
            }
            .card-content {
              padding: 20px;
            }
            .card-title {
              font-size: 24px;
              margin-bottom: 8px;
            }
            .card-description {
              font-size: 13px;
              margin-bottom: 12px;
              -webkit-line-clamp: 2;
            }
            .meta-grid {
              gap: 10px;
              margin-bottom: 12px;
            }
            .meta-text {
              font-size: 13px;
            }
            .register-btn {
              padding: 8px 16px;
              font-size: 13px;
            }
            .scroll-wrapper {
              height: 400vh; 
            }
            .controls-group {
              display: none;
            }
            .main-title {
              font-size: 26px;
              margin-bottom: 8px;
            }
            .main-wrapper {
              padding: 0 40px;
            }
          }
        `}</style>

        <div className="main-wrapper">
          <div className="header-controls">
            <div>
            <div className="header-label">
              <div className="dots-row">
                  <div className="dot" style={{ backgroundColor: 'var(--google-blue)' }} />
                  <div className="dot" style={{ backgroundColor: 'var(--google-red)' }} />
                  <div className="dot" style={{ backgroundColor: 'var(--google-yellow)' }} />
                  <div className="dot" style={{ backgroundColor: 'var(--google-green)' }} />
              </div>
            </div>
            <h1 className="main-title">Chapter events</h1>
            <p className="main-description">Discover, learn, and grow with the Google Developer community on your campus.</p>
            </div>

            <div className="controls-group">
               <div className="pagination-container">
                 {events.map((_, i) => (
                   <button 
                    key={i}
                    onClick={() => handleNavClick(i)}
                    className="page-btn"
                    style={{
                      backgroundColor: i === activeIndex ? 'var(--google-blue)' : '#E0E0E0',
                      width: i === activeIndex ? '32px' : '10px'
                    }}
                   />
                 ))}
               </div>

               <div className="arrows-container">
                 <button 
                  onClick={() => handleNavClick(Math.max(0, activeIndex - 1))} 
                  className="arrow-btn"
                  disabled={activeIndex === 0}
                 >
                   <ChevronLeft size={20}/>
                 </button>
                 <button 
                  onClick={() => handleNavClick(Math.min(events.length - 1, activeIndex + 1))} 
                  className="arrow-btn"
                  disabled={activeIndex === events.length - 1}
                 >
                   <ChevronRight size={20}/>
                 </button>
               </div>
            </div>
          </div>

          <div className="carousel-grid">
            {events.map((event, index) => (
              <EventCard 
                key={event.id}
                event={event}
                color={colors[index % colors.length]}
                isActive={index === activeIndex}
                onClick={() => handleNavClick(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
