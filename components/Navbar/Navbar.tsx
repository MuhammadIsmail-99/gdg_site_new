import React from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.gdg}>GDGoC</span>
          <span className={styles.chapter}>Chapter</span>
        </Link>
        
        <ul className={styles.navLinks}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/events">Events</Link></li>
          <li><Link href="/team">Team</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li><Link href="/resources">Resources</Link></li>
          <li><Link href="/join" className="btn-primary">Join Us</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
