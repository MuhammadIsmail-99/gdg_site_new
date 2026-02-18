"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import styles from './EventsCarousel.module.css';

const events = [
    {
        id: 1,
        title: "Google Cloud Study Jam",
        date: "Feb 25, 2026",
        description: "Hands-on workshop on GCP fundamentals and certifications.",
        category: "Workshop",
        color: "var(--gdg-blue)"
    },
    {
        id: 2,
        title: "Web Dev BootCamp",
        date: "March 05, 2026",
        description: "Master modern web development with React and Next.js.",
        category: "Bootcamp",
        color: "var(--gdg-green)"
    },
    {
        id: 3,
        title: "Solution Challenge Hack",
        date: "March 20, 2026",
        description: "Build solutions for the UN Sustainable Development Goals.",
        category: "Hackathon",
        color: "var(--gdg-yellow)"
    },
    {
        id: 4,
        title: "AI & ML Summit",
        date: "April 12, 2026",
        description: "Explore the latest in Gemini and TensorFlow.",
        category: "Summit",
        color: "var(--gdg-red)"
    },
    {
        id: 5,
        title: "Android Dev Day",
        date: "April 28, 2026",
        description: "Deep dive into Kotlin and Jetpack Compose.",
        category: "Study Jam",
        color: "var(--gdg-blue)"
    }
];

const EventsCarousel = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Add smooth spring physics to the scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Translate from 0% to -65% using the smooth progress
    const x = useTransform(smoothProgress, [0, 1], ["0%", "-65%"]);

    return (
        <section ref={targetRef} className={styles.scrollTrack}>
            <div className={styles.stickyContainer}>
                <div className="container">
                    <div className={styles.header}>
                        <div>
                            <span className="subheader">Don't Miss Out</span>
                            <h2>Upcoming Events</h2>
                        </div>
                        <Link href="/events" className={styles.viewAll}>View All Events →</Link>
                    </div>

                    <div className={styles.carousel}>
                        <motion.div style={{ x }} className={styles.innerCarousel}>
                            {events.map((event, index) => (
                                <div
                                    key={event.id}
                                    className={styles.eventCard}
                                >
                                    <div className={styles.cardHeader} style={{ borderTop: `4px solid ${event.color}` }}>
                                        <span className={styles.category} style={{ color: event.color }}>{event.category}</span>
                                        <span className={styles.date}>{event.date}</span>
                                    </div>
                                    <h3>{event.title}</h3>
                                    <p>{event.description}</p>
                                    <Link href={`/events/${event.id}`} className={styles.learnMore} style={{ color: event.color }}>
                                        Learn More →
                                    </Link>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventsCarousel;
