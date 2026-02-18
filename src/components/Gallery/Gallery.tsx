"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './Gallery.module.css';

const images = [
    { src: '/images/gallery/collaboration.png', alt: 'Collaboration', size: 'bentoLarge', color: 'blue', label: 'Collaboration' },
    { src: '/images/gallery/workshop.png', alt: 'Workshop', size: 'bentoMedium', color: 'red', label: 'Workshops' },
    { src: '/images/gallery/speaker.png', alt: 'Speaker', size: 'bentoSmall', color: 'yellow', label: 'Tech Talks' },
    { src: '/images/gallery/networking.png', alt: 'Networking', size: 'bentoSmall', color: 'green', label: 'Networking' },
];

const Gallery = () => {
    return (
        <section className={styles.gallery}>
            <div className="container">
                <div className={styles.header}>
                    <span className="subheader">Join the Community</span>
                    <h2>Community in Action</h2>
                    <p>Discover the passion and innovation driving our student developer chapter forward through every event and collaboration.</p>
                </div>

                {/* Decorative Elements */}
                <div className={styles.decorations}>
                    <div className={`${styles.shape} ${styles.circle1}`}></div>
                    <div className={`${styles.shape} ${styles.circle2}`}></div>
                    <div className={`${styles.shape} ${styles.dots}`}></div>
                </div>

                <div className={styles.grid}>
                    {images.map((image, index) => (
                        <motion.div
                            key={index}
                            className={`${styles.item} ${styles[image.size]} ${styles[image.color]}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className={styles.image}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className={styles.overlay}>
                                    <span className={styles.label}>{image.label}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
