"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

const Hero = () => {
    return (
        <section className={styles.hero} data-aos="fade-up">
            <div className={`container ${styles.heroContainer} ${styles.heroContent}`}>
                <motion.div
                    className={styles.content}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Subheader reveals AFTER heading */}
                    <motion.span
                        className="subheader"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } }
                        }}
                    >
                        Google Developer Groups on Campus CUI Wah
                    </motion.span>

                    {/* Heading reveals FIRST */}
                    <motion.h1
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 } }
                        }}
                    >
                        CONNECT. LEARN. GROW <span className={styles.highlight}>together.</span>
                    </motion.h1>

                    <motion.p
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.6 } }
                        }}
                    >
                        Join our community of student developers to learn new technologies,
                        build real-world projects, and grow your professional network at the forefront of innovation.
                    </motion.p>

                    <motion.div
                        className={styles.cta}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.8 } }
                        }}
                    >
                        <Link href="/join" className="btn-primary">Become a Member</Link>
                        <Link href="/events" className={styles.secondaryBtn}>View Events →</Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
