import React from 'react';
import styles from './Team.module.css';

const TeamPage = () => {
    const team = [
        { name: 'Lead Name', role: 'GDGoC Lead', bio: 'Passionate about building communities and tech.', color: 'var(--gdg-blue)' },
        { name: 'Co-Lead Name', role: 'Co-Lead', bio: 'Web dev enthusiast and open source contributor.', color: 'var(--gdg-green)' },
        { name: 'Member Name', role: 'Tech Lead', bio: 'Exploring the depths of AI and Machine Learning.', color: 'var(--gdg-yellow)' },
        { name: 'Member Name', role: 'Events Lead', bio: 'Loves organizing hackathons and workshops.', color: 'var(--gdg-red)' },
        { name: 'Member Name', role: 'Design Lead', bio: 'Creating beautiful experiences with UI/UX.', color: 'var(--gdg-blue-light)' },
        { name: 'Member Name', role: 'Content Lead', bio: 'Storyteller and technical writer.', color: 'var(--gdg-green-light)' },
    ];

    return (
        <div className="container">
            <section className={styles.header}>
                <span className="subheader">Our Leadership</span>
                <h1>Meet the Team</h1>
                <p>The student leaders behind our GDGoC chapter.</p>
            </section>

            <div className={styles.teamGrid}>
                {team.map((member, index) => (
                    <div key={index} className={styles.memberCard}>
                        <div className={styles.imagePlaceholder} style={{ backgroundColor: member.color }}></div>
                        <div className={styles.memberInfo}>
                            <span className={styles.role} style={{ color: member.color }}>{member.role}</span>
                            <h3>{member.name}</h3>
                            <p>{member.bio}</p>
                        </div>
                    </div>
                ))}
            </div>

            <section className={styles.structure}>
                <h2>Organizational Structure</h2>
                <div className={styles.structureDiagram}>
                    <div className={styles.node}>Chapter Lead</div>
                    <div className={styles.connector}></div>
                    <div className={styles.row}>
                        <div className={styles.node}>Tech</div>
                        <div className={styles.node}>Events</div>
                        <div className={styles.node}>Design</div>
                        <div className={styles.node}>Content</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TeamPage;
