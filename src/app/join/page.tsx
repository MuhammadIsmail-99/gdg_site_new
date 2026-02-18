"use client";

import React, { useState } from 'react';
import styles from './Join.module.css';

const JoinPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        major: '',
        graduationYear: '',
        interests: '',
        reason: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Application submitted:', formData);
        alert('Thank you for your interest! We will review your application soon.');
    };

    return (
        <div className="container">
            <div className={styles.joinHeader}>
                <span className="subheader">Join the Community</span>
                <h1>Membership Application</h1>
                <p>Fill out the form below to apply for GDGoC membership. Our core team reviews applications on a rolling basis.</p>
            </div>

            <div className={styles.formWrapper}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="university-email@edu.pk"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="major">Major / Field of Study</label>
                            <input
                                type="text"
                                id="major"
                                name="major"
                                value={formData.major}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Computer Science"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="graduationYear">Graduation Year</label>
                            <select
                                id="graduationYear"
                                name="graduationYear"
                                value={formData.graduationYear}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Year</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                                <option value="2028">2028</option>
                                <option value="2029">2029</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="interests">Areas of Interest</label>
                        <input
                            type="text"
                            id="interests"
                            name="interests"
                            value={formData.interests}
                            onChange={handleChange}
                            placeholder="e.g. Web, Android, Cloud, AI/ML"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="reason">Why do you want to join?</label>
                        <textarea
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="Tell us a bit about your motivation..."
                        ></textarea>
                    </div>

                    <button type="submit" className="btn-primary">Submit Application</button>
                </form>

                <div className={styles.info}>
                    <div className={styles.infoBlock}>
                        <h3>Requirements</h3>
                        <ul>
                            <li>Must be a current university student</li>
                            <li>Passion for technology and community</li>
                            <li>Willingness to learn and collaborate</li>
                        </ul>
                    </div>

                    <div className={styles.infoBlock}>
                        <h3>Benefits</h3>
                        <ul>
                            <li>Access to Google technologies and training</li>
                            <li>Network with industry professionals</li>
                            <li>Hands-on experience building projects</li>
                            <li>Certificates for event attendance</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinPage;
