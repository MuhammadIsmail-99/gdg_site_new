"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
// import { logout } from '@/app/actions/auth';
import styles from './Navbar.module.css';

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <img src="/images/GDG-Lockup.svg" alt="GDG Logo" className={styles.logoImage} />
        </Link>
        
        <ul className={styles.navLinks}>
          <li><Link href="/" className={pathname === '/' ? styles.active : ''}>Home</Link></li>
          <li><Link href="/events" className={pathname === '/events' ? styles.active : ''}>Events</Link></li>
          <li><Link href="/team" className={pathname === '/team' ? styles.active : ''}>Team</Link></li>
          <li><Link href="/clubs" className={pathname === '/clubs' ? styles.active : ''}>Clubs</Link></li>
          <li><Link href="/resources" className={pathname === '/resources' ? styles.active : ''}>Resources</Link></li>
          
          {!isLoading && (
            <>
              {session ? (
                <>
                  <li>
                    <Link href="/dashboard" className={`${styles.joinBtn} ${pathname.startsWith('/dashboard') ? styles.active : ''}`}>
                      Go to Dashboard
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.logoutBtn} style={{ marginLeft: '12px' }}>
                      Sign out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login" className={`${pathname === '/login' ? styles.active : ''} ${styles.joinBtn}`}>
                    Sign In
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

