import React from 'react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    return (
        <div className="container">
            <section className={styles.header}>
                <h1>Welcome back, Member!</h1>
                <p className="subheader">Member ID: GDG-2026-001</p>
            </section>

            <div className={styles.grid}>
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span>Events Attended</span>
                        <h3>12</h3>
                    </div>
                    <div className={styles.stat}>
                        <span>Certificates</span>
                        <h3>4</h3>
                    </div>
                    <div className={styles.stat}>
                        <span>Points</span>
                        <h3>450</h3>
                    </div>
                </div>

                <div className={styles.resources}>
                    <h2>Member-only Resources</h2>
                    <ul>
                        <li>Exclusive Workshop Slides (Advanced Next.js)</li>
                        <li>Chapter Swag Design Files</li>
                        <li>Internal Networking Directory</li>
                    </ul>
                </div>

                <div className={styles.announcements}>
                    <h2>Internal Announcements</h2>
                    <div className={styles.announcement}>
                        <span className={styles.tag}>News</span>
                        <p>Core team applications for the next semester start March 1st.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
