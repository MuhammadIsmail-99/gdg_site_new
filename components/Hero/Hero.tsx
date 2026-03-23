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
                    {/* Heading reveals FIRST */}
                    <motion.h1
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 } }
                        }}
                    >
                        Welcome to GDGoC CUI Wah Chapter
                    </motion.h1>

                    <motion.p
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.6 } }
                        }}
                    >
                        Join a thriving community of student developers at COMSATS University Wah. Build skills, collaborate on tech projects, and connect with fellow enthusiasts.
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
