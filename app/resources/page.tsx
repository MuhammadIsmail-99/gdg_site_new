import React from 'react';
import styles from './Resources.module.css';

const ResourcesPage = () => {
    const categories = [
        { title: 'Web Development', items: ['React Fundamentals', 'Advanced CSS', 'Next.js Guide'], color: 'var(--gdg-blue)' },
        { title: 'Android/Mobile', items: ['Kotlin Basics', 'Compose UI', 'Architecture Patterns'], color: 'var(--gdg-green)' },
        { title: 'Cloud/DevOps', items: ['GCP Essentials', 'Docker for Beginners', 'CI/CD Pipelines'], color: 'var(--gdg-yellow)' },
        { title: 'AI & Machine Learning', items: ['Python for DS', 'TensorFlow 101', 'NLP Basics'], color: 'var(--gdg-red)' },
    ];

    return (
        <div className="container">
            <section className={styles.header}>
                <span className="subheader">Learn & Grow</span>
                <h1>Learning Resources</h1>
                <p>Curated tutorials, documentation, and materials from our workshops.</p>
            </section>

            <div className={styles.resourceGrid}>
                {categories.map((cat, index) => (
                    <div key={index} className={styles.categoryCard}>
                        <div className={styles.categoryHeader} style={{ borderLeftColor: cat.color }}>
                            <h2 style={{ color: cat.color }}>{cat.title}</h2>
                        </div>
                        <ul className={styles.resourceList}>
                            {cat.items.map((item, i) => (
                                <li key={i}>
                                    <a href="#">{item}</a>
                                </li>
                            ))}
                        </ul>
                        <button className={styles.exploreBtn}>Explore Path →</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResourcesPage;
