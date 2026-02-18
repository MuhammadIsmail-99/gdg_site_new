"use client";

import React from 'react';
import Image from 'next/image';
import styles from './Partners.module.css';

const partners = [
    { name: 'Air University', logo: '/partners/Air University.png' },
    { name: 'GDGoC CUI', logo: '/partners/GDGoC CUI Chapter Logo.png' },
    { name: 'DataCamp', logo: '/partners/datacamp.png' },
    { name: 'GitHub', logo: '/partners/github.png' },
];

const Partners = () => {
    return (
        <section className={styles.partners} data-aos="fade-up">
            <div className="container">
                <div className={styles.header}>
                    <span className="subheader">Collaborators</span>
                    <h2>Our Partners</h2>
                </div>

                <div className={styles.logoGrid}>
                    {partners.map((partner, index) => (
                        <div key={index} className={`${styles.logoItem} ${partner.name === 'GitHub' ? styles.githubLogo : ''}`}>
                            <div className={styles.logoWrapper}>
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    fill
                                    className={styles.logoImage}
                                    sizes="(max-width: 768px) 150px, 200px"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Partners;
