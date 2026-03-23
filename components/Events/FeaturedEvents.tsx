'use client';
import React, { useState } from 'react';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import styles from './FeaturedEvents.module.css';

const FeaturedEvents = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const events = [
    {
      id: 1,
      title: "Build with AI - Workshop on Google AI Tools",
      date: "Mar 28",
      location: "Jammu",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
      status: "upcoming"
    },
    {
      id: 2,
      title: "GDG x DSA Series: Master Data Structure & Algorithms",
      date: "Jan 26",
      location: "Chandigarh",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Flutter Basics to Your First App: A Practical Flutter Workshop",
      date: "Mar 24",
      location: "Chandigarh",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
      status: "past"
    },
    {
      id: 4,
      title: "Build With AI: The Vibecoding Experience",
      date: "Apr 4",
      location: "Islamabad",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      status: "upcoming"
    }
  ];

  const filteredEvents = events.filter(event => event.status === activeTab);

  return (
    <div className={styles.section} data-aos="fade-up">
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.dots}>
            <span className={`${styles.dot} ${styles.dotBlue}`}></span>
            <span className={`${styles.dot} ${styles.dotRed}`}></span>
            <span className={`${styles.dot} ${styles.dotYellow}`}></span>
            <span className={`${styles.dot} ${styles.dotGreen}`}></span>
          </div>
          <h2 className={styles.title}>
            Featured Events
          </h2>
          <p className={styles.subtitle}>
            Join our vibrant community to learn new skills, network with peers, and build amazing products together.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabContainer}>
          <div className={styles.tabGroup}>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`${styles.tab} ${activeTab === 'upcoming' ? styles.tabActive : ''}`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`${styles.tab} ${activeTab === 'past' ? styles.tabActive : ''}`}
            >
              Past Sessions
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className={styles.grid}>
          {filteredEvents.map((event) => (
            <div key={event.id} className={styles.card}>
              <div className={styles.imageContainer}>
                <img 
                  src={event.image} 
                  alt={event.title}
                  className={styles.image}
                />
              </div>

              <div className={styles.content}>
                <h3 className={styles.cardTitle}>
                  {event.title}
                </h3>
                <div className={styles.cardFooter}>
                  <div className={styles.footerItem}>
                    <Users size={16} />
                    <span>{event.location}</span>
                  </div>
                  <div className={styles.footerItem}>
                    <Calendar size={16} />
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Footer */}
        <div className={styles.footerCta}>
          <p>Can't find what you're looking for?</p>
          <button className={styles.browseBtn}>
            Browse all events in the Archive
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvents;
