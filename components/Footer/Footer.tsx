import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
                <div className={styles.footerBrand}>
                    <div className={styles.logo}>
                        <img src="/images/GDG-Lockup.svg" alt="GDG Logo" className={styles.logoImage} />
                    </div>
                    <p className={styles.tagline}>Google Developer Groups on Campus</p>
                    <p className={styles.university}>CUI Wah Chapter</p>
                    <div className={styles.brandBoxes}>
                        <div className={`${styles.box} ${styles.boxRed}`}></div>
                        <div className={`${styles.box} ${styles.boxBlue}`}></div>
                        <div className={`${styles.box} ${styles.boxYellow}`}></div>
                    </div>
                </div>

                <div className={styles.footerLinks}>
                    <div className={styles.linkGroup}>
                        <h4>Explore</h4>
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/events">Chapter events</Link></li>
                            <li><Link href="/team">Core Team</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linkGroup}>
                        <h4>Resources</h4>
                        <ul>
                            <li><Link href="/blog">Blog</Link></li>
                            <li><Link href="/resources">Learning Resources</Link></li>
                            <li><Link href="/resources">Google Codelabs</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linkGroup}>
                        <h4>Social</h4>
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
                    {/* <p>© 2026 GDGoC CUI Wah Chapter. All Rights Reserved.</p> */}
                    <p className={styles.trademark}>© 2026 GDGoC CUI Wah Chapter. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
