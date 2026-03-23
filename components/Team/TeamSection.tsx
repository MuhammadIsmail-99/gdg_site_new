"use client";

import React from 'react';
import styles from './TeamSection.module.css';

const TeamSection = () => {
    const team = [
        {
            id: 1,
            name: "Dr. Kashif Ayyub",
            role: "Faculty Advisor",
            image: "/images/team/kashif_ayub.png",
            cardClass: styles.cardBlue,
            ringClass: styles.ringBlue,
            badgeClass: styles.badgeBlue
        },
        {
            id: 2,
            name: "Ubaid Ghazi",
            role: "Campus Lead",
            image: "/images/team/ubaid.png",
            cardClass: styles.cardRed,
            ringClass: styles.ringRed,
            badgeClass: styles.badgeRed
        },
        {
            id: 3,
            name: "Laiba Faiz",
            role: "Chairperson",
            image: "/images/team/laiba_faiz.png",
            cardClass: styles.cardYellow,
            ringClass: styles.ringYellow,
            badgeClass: styles.badgeYellow
        },
        {
            id: 4,
            name: "Junaid Mehmood",
            role: "General Secretary",
            image: "/images/team/junaid_mehmood.png",
            cardClass: styles.cardGreen,
            ringClass: styles.ringGreen,
            badgeClass: styles.badgeGreen
        }
    ];

    return (
        <section className={styles.container} data-aos="fade-up">
            {/* Header Section */}
            <header className={styles.header}>
                <h2 className={styles.title}>Meet the Leadership</h2>
                <p className={styles.description}>
                    A diverse group of student developers, designers, and community builders at <span className={styles.brandName}>GDGOC</span> working together to bridge the gap between theory and industry-standard practice.
                </p>
            </header>

            {/* Team Grid */}
            <div className={styles.teamGrid}>
                {team.map((member) => (
                    <div key={member.id} className={styles.teamCardWrapper}>
                        <div className={`${styles.teamCard} ${member.cardClass}`}>
                            <div className={styles.avatarContainer}>
                                <div className={`${styles.avatarRing} ${member.ringClass}`}>
                                    <img src={member.image} alt={member.name} />
                                </div>
                            </div>
                            <h3 className={styles.memberName}>{member.name}</h3>
                            <div className={`${styles.roleBadge} ${member.badgeClass}`}>
                                {member.role}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Indicator for detailed team page */}
            <div className={styles.contributorsSection}>
                <p className={styles.contributorsText}>And 12+ other amazing contributors</p>
                <a href="/team" className={styles.viewAllLink}>
                    <span>View all members</span>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                </a>
            </div>
        </section>
    );
};

export default TeamSection;
