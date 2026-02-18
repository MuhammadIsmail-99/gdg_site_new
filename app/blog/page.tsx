import React from 'react';
import styles from './Blog.module.css';

const BlogPage = () => {
    const posts = [
        { title: 'Getting Started with Next.js', author: 'Tech Lead', date: 'Feb 10, 2026', excerpt: 'Learn the basics of the App Router and SSR.' },
        { title: 'Our First Hackathon Experience', author: 'Lead', date: 'Jan 20, 2026', excerpt: 'A recap of the excitement and projects built.' },
        { title: 'Why Android Development Matters', author: 'Member', date: 'Jan 05, 2026', excerpt: 'Exploring the modern Android ecosystem.' },
    ];

    return (
        <div className="container">
            <section className={styles.header}>
                <span className="subheader">Knowledge Base</span>
                <h1>Chapter Blog</h1>
                <p>Technical articles, event recaps, and student project showcases.</p>
            </section>

            <div className={styles.blogGrid}>
                {posts.map((post, index) => (
                    <div key={index} className={styles.postCard}>
                        <div className={styles.cardHeader}>
                            <span className={styles.date}>{post.date}</span>
                        </div>
                        <h3>{post.title}</h3>
                        <p className={styles.excerpt}>{post.excerpt}</p>
                        <div className={styles.footer}>
                            <span className={styles.author}>By {post.author}</span>
                            <button className={styles.readMore}>Read More →</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;
