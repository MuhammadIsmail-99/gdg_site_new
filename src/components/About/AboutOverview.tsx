"use client";

import React from 'react';
import styles from './AboutOverview.module.css';

const AboutOverview = () => {
    return (
        <section className={styles.about}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.left}>
                        <span className="subheader">Our Vision</span>
                        <h2>Bridging the gap between theory and practice.</h2>
                    </div>
                    <div className={styles.right}>
                        <p>
                            GDGoC is a university-based community group for students interested in Google developer technologies.
                            Students from all undergraduate or graduate programs with an interest in growing as a developer are welcome.
                        </p>
                        <p>
                            By joining a GDGoC, students grow their knowledge in a peer-to-peer learning environment and build
                            solutions for local businesses and their community.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutOverview;
