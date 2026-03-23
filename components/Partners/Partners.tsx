import React from 'react';
import Image from 'next/image';
import styles from './Partners.module.css';
import { prisma } from '@/lib/prisma';

async function getPartners() {
    return prisma.partner.findMany({
        orderBy: { order: 'asc' },
    });
}

export default async function Partners() {
    const partners = await getPartners();

    return (
        <section className={styles.partners}>
            <div className="container">
                <div className={styles.header}>
                    <span className="subheader">Collaborators</span>
                    <h2>Our Partners</h2>
                </div>

                <div className={styles.logoGrid}>
                    {partners.map((partner) => (
                        <div key={partner.id} className={`${styles.logoItem} ${partner.name === 'GitHub' ? styles.githubLogo : ''}`}>
                            <div className={styles.logoWrapper}>
                                {partner.logoUrl ? (
                                    <Image
                                        src={partner.logoUrl}
                                        alt={partner.name}
                                        fill
                                        className={styles.logoImage}
                                        sizes="(max-width: 768px) 150px, 200px"
                                    />
                                ) : (
                                    <div className={styles.placeholder}>{partner.name}</div>
                                )}
                            </div>
                        </div>
                    ))}
                    {partners.length === 0 && (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5 }}>Community partners coming soon.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
