import React from 'react';
import Link from 'next/link';
import styles from './Features.module.css';

const Features = () => {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className={styles.header}>
                    <span className="subheader">What&apos;s Happening</span>
                    <h2>Explore our chapter</h2>
                </div>

                <div className={styles.featureGrid}>
                    <div className={`${styles.featureCard} ${styles.blue}`}>
                        <h3>Upcoming Events</h3>
                        <p>Don&apos;t miss out on our next workshop, hackathon, or study jam. Register now!</p>
                        <Link href="/events" className={styles.learnMore}>View Events →</Link>
                    </div>

                    <div className={`${styles.featureCard} ${styles.green}`}>
                        <h3>Latest Blog Posts</h3>
                        <p>Read technical articles, event recaps, and student project showcases.</p>
                        <Link href="/blog" className={styles.learnMore}>Read Blog →</Link>
                    </div>

                    <div className={`${styles.featureCard} ${styles.yellow}`}>
                        <h3>Resources</h3>
                        <p>Access learning paths, tutorials, and materials from our past workshops.</p>
                        <Link href="/resources" className={styles.learnMore}>Explore Resources →</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
