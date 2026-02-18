import React from 'react';
import styles from './About.module.css';

const AboutPage = () => {
    return (
        <div className="container">
            <section className={styles.section}>
                <span className="subheader">Our Chapter</span>
                <h1>About the Chapter</h1>
                <p className={styles.lead}>
                    Google Developer Groups on Campus (GDGoC) are community groups for college and university students
                    interested in Google developer technologies.
                </p>
            </section>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h2 className={styles.blue}>Mission</h2>
                    <p>
                        Our mission is to bridge the gap between theory and practice for student developers.
                        We provide a platform for students to learn new technologies and apply them to build real-world solutions.
                    </p>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.green}>Values</h2>
                    <p>
                        We value inclusiveness, collaboration, and continuous learning.
                        Our community is open to all students, regardless of their background or year of study.
                    </p>
                </div>
            </div>

            <section className={styles.achievements}>
                <h2>Achievements & Milestones</h2>
                <ul className={styles.milestones}>
                    <li>
                        <span className={styles.dot}></span>
                        <div>
                            <h3>2025</h3>
                            <p>Recognized as one of the fastest-growing chapters in the region.</p>
                        </div>
                    </li>
                    <li>
                        <span className={styles.dot}></span>
                        <div>
                            <h3>2024</h3>
                            <p>Hosted the first-ever inter-university hackathon with 200+ participants.</p>
                        </div>
                    </li>
                    <li>
                        <span className={styles.dot}></span>
                        <div>
                            <h3>2023</h3>
                            <p>Chapter established with a core team of 10 student leaders.</p>
                        </div>
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default AboutPage;
