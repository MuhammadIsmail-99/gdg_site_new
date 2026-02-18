"use client";

import React from 'react';
import { Share2, Users, Award, ArrowRight, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './FeaturesDashboard.module.css';

const FeaturesDashboard = () => {
    return (
        <section className={styles.section} data-aos="fade-up">
            <main className={styles.main}>
                {/* New Centered Vision Header */}
                <div className={styles.visionHeader}>
                    <div className={styles.visionContainer}>
                        {/* Label */}
                        <motion.p
                            className={styles.visionLabel}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                        >
                            Our Vision
                        </motion.p>

                        {/* Main Content */}
                        <h2 className={styles.visionTitle}>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                                className="inline-block"
                            >
                                Bridging the gap between theory and practice
                            </motion.span>

                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                                className={styles.iconWrapper}
                            >
                                {/* High-quality GDG official style <> icon */}
                                <svg className={styles.visionIcon} viewBox="0 0 50 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 6L4 12L12 18" stroke="#4285F4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 19L24.5 13" stroke="#EA4335" strokeWidth="4" strokeLinecap="round" />
                                    <path d="M25.5 11L28 5" stroke="#FBBC05" strokeWidth="4" strokeLinecap="round" />
                                    <path d="M38 6L46 12L38 18" stroke="#34A853" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </motion.span>

                            <br className="hidden md:block" />
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                                className={styles.visionSubtitle}
                            >
                                through a collaborative learning community.
                            </motion.span>
                        </h2>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <motion.div
                    className={styles.grid}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                >

                    {/* Technical Excellence Card */}
                    <div className={`${styles.card} ${styles.techCard}`}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconBox}>
                                <Terminal className={styles.icon} />
                            </div>
                            <h3 className={styles.title}>Technical Excellence</h3>
                            <p className={styles.description}>
                                Bridge the gap between theory and practice. Master industry-leading stacks like Flutter, Firebase, and Cloud Computing through peer-led workshops.
                            </p>
                        </div>

                        <div className={styles.terminal}>
                            <div className={styles.dots}>
                                <div className={styles.dotRed} />
                                <div className={styles.dotYellow} />
                                <div className={styles.dotGreen} />
                            </div>
                            <div className={styles.code}>
                                <p><span className={styles.keyword}>import</span> {'{ GDGOC }'} <span className={styles.keyword}>from</span> <span className={styles.string}>"@wah/campus"</span>;</p>
                                <p><span className={styles.keyword}>const</span> community = <span className={styles.keyword}>new</span> <span className={styles.class}>GDGOC</span>();</p>
                                <p>community.<span className={styles.function}>solveRealProblems</span>();</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.statsGrid}>
                        {/* Community Stat Card */}
                        <div className={`${styles.card} ${styles.statCard} ${styles.statCardRed}`}>
                            <div className={styles.fadedIcon}>
                                <Users className={styles.iconRed} style={{ width: '128px', height: '128px' }} />
                            </div>
                            <div className={styles.statContent}>
                                <h3 className={styles.statValue}>1,000+</h3>
                                <p className={styles.statLabel}>Active Innovators</p>
                            </div>
                        </div>

                        {/* Recognition Stat Card */}
                        <div className={`${styles.card} ${styles.statCard} ${styles.statCardGreen}`}>
                            <div className={styles.fadedIcon}>
                                <Award className={styles.iconGreen} style={{ width: '128px', height: '128px' }} />
                            </div>
                            <div className={styles.statContent}>
                                <h3 className={styles.statValue}>Global</h3>
                                <p className={styles.statLabel}>Network Reach</p>
                            </div>
                        </div>

                        {/* Encouraging CTA Card */}
                        <div className={`${styles.card} ${styles.ctaCard}`}>
                            <div className={styles.ctaContent}>
                                <h3 className={styles.ctaTitle}>Be Part of the Story</h3>
                                <p className={styles.ctaText}>
                                    Don't build alone. Join a community where your ideas matter and your potential is limitless.
                                </p>

                                <button className={styles.ctaBtn}>
                                    Join Our Family
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Share Icon at Bottom Right */}
                            <div className={styles.shareIconBox}>
                                <div className={styles.shareCircle}>
                                    <Share2 className={styles.shareIcon} />
                                </div>
                            </div>

                            {/* Decorative Accents */}
                            <div className={styles.accent} />
                            <div className={styles.gridOverlay} />
                        </div>
                    </div>
                </motion.div>
            </main>
        </section>
    );
};

export default FeaturesDashboard;
