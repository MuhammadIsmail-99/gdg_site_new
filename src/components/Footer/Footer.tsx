import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
                <div className={styles.footerBrand}>
                    <div className={styles.logo}>
                        <span className={styles.gdg}>GDGoC</span>
                        <span className={styles.chapter}>Chapter</span>
                    </div>
                    <p className={styles.tagline}>Google Developer Groups on Campus</p>
                    <p className={styles.university}>University Affiliated Chapter</p>
                </div>

                <div className={styles.footerLinks}>
                    <div className={styles.linkGroup}>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/events">Events</Link></li>
                            <li><Link href="/team">Team</Link></li>
                            <li><Link href="/blog">Blog</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linkGroup}>
                        <h4>Resources</h4>
                        <ul>
                            <li><Link href="/resources">Learning Paths</Link></li>
                            <li><Link href="/resources">Codelabs</Link></li>
                            <li><Link href="/resources">Documentation</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linkGroup}>
                        <h4>Connect</h4>
                        <ul>
                            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <div className="container">
                    <p>© 2026 GDGoC Chapter. Google Developer Groups on Campus and related marks are trademarks of Google LLC.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
