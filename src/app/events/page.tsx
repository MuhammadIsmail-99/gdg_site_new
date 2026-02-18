"use client";

import React, { useState } from 'react';
import styles from './Events.module.css';

const EventsPage = () => {
    const [filter, setFilter] = useState('All');

    const events = [
        { title: 'Cloud Study Jam', date: 'Feb 25, 2026', type: 'Workshop', status: 'Upcoming', image: 'var(--gdg-blue)' },
        { title: 'Android Dev Day', date: 'Mar 10, 2026', type: 'Speaker Session', status: 'Upcoming', image: 'var(--gdg-green)' },
        { title: 'Hackathon 2026', date: 'Apr 05, 2026', type: 'Hackathon', status: 'Upcoming', image: 'var(--gdg-red)' },
        { title: 'Web Refresher', date: 'Jan 15, 2026', type: 'Workshop', status: 'Past', image: 'var(--gdg-yellow)' },
    ];

    const filteredEvents = filter === 'All' ? events : events.filter(e => e.status === filter);

    return (
        <div className="container">
            <section className={styles.header}>
                <span className="subheader">What&apos;s Next</span>
                <h1>Events Calendar</h1>
                <p>Stay updated with our latest workshops, hackathons, and speaker sessions.</p>

                <div className={styles.filters}>
                    <button onClick={() => setFilter('All')} className={filter === 'All' ? styles.active : ''}>All Events</button>
                    <button onClick={() => setFilter('Upcoming')} className={filter === 'Upcoming' ? styles.active : ''}>Upcoming</button>
                    <button onClick={() => setFilter('Past')} className={filter === 'Past' ? styles.active : ''}>Past Archive</button>
                </div>
            </section>

            <div className={styles.eventGrid}>
                {filteredEvents.map((event, index) => (
                    <div key={index} className={styles.eventCard}>
                        <div className={styles.eventImage} style={{ backgroundColor: event.image }}>
                            <span className={styles.statusBadge}>{event.status}</span>
                        </div>
                        <div className={styles.eventInfo}>
                            <span className={styles.type}>{event.type}</span>
                            <h3>{event.title}</h3>
                            <p className={styles.date}>{event.date}</p>
                            <button className={event.status === 'Upcoming' ? 'btn-primary' : styles.viewBtn}>
                                {event.status === 'Upcoming' ? 'Register Now' : 'View Highlights'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventsPage;
