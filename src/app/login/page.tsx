"use client";

import React from 'react';
import Link from 'next/link';
import styles from './Login.module.css';

const LoginPage = () => {
    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <span className="subheader">Members Portal</span>
                <h1>Login to GDGoC</h1>
                <p>Enter your credentials to access member-only resources.</p>

                <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                    <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <input type="email" placeholder="name@example.com" required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" required />
                    </div>
                    <Link href="/login" className="btn-primary" style={{ textAlign: 'center', display: 'block' }}>
                        Login
                    </Link>
                </form>

                <p className={styles.switch}>
                    Not a member yet? <Link href="/join">Apply here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
