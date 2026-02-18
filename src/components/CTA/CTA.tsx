"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './CTA.module.css';

/**
 * Brand-Focused CTA Component
 * Features:
 * 1. Staggered animations for content entry using framer-motion.
 * 2. Brand-colored geometric shapes (Red, Yellow, Green).
 * 3. High-contrast white typography on GDG Blue.
 * 4. CSS Modules implementation for project consistency.
 */
const CTA = () => {
    // Animation variants for staggered children entry
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
    };

    return (
        <section className={styles.ctaSection} data-aos="fade-up">
            <div className={styles.container}>
                <motion.div
                    className={styles.content}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {/* Headline */}
                    <motion.h2
                        variants={itemVariants}
                        className={styles.title}
                    >
                        Ready to start your <br className="hidden md:block" />
                        <span className={styles.highlight}>next big journey?</span>
                    </motion.h2>

                    {/* Sub-text */}
                    <motion.p
                        variants={itemVariants}
                        className={styles.description}
                    >
                        Join a global community of developers. Get access to exclusive workshops,
                        Google-certified mentors, and a network that helps you grow.
                    </motion.p>

                    {/* Call to Action Buttons */}
                    <motion.div variants={itemVariants} className={styles.buttonGroup}>
                        <motion.button
                            className={styles.joinBtn}
                            whileHover={{ y: -4 }}
                        >
                            Join Our Community
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>

                        <button className={styles.eventsBtn}>
                            View Past Events
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
