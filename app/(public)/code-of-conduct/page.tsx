'use client'

import React from 'react';
import { Shield, UserCheck, Scale, Flag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const CodeOfConduct = () => {
    return (
        <div className="coc-container">
            <style jsx>{`
                .coc-container {
                    min-height: 100vh;
                    background-color: #ffffff;
                    color: #202124;
                    font-family: 'Google Sans Text', 'Roboto', sans-serif;
                    line-height: 1.6;
                    padding-bottom: 80px;
                }

                .hero {
                    padding: 6rem 1.5rem 4rem 1.5rem;
                    background: #f8f9fa;
                    border-bottom: 1px solid #dadce0;
                    text-align: center;
                }

                .hero-content { max-width: 800px; margin: 0 auto; }
                
                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: #5f6368;
                    font-weight: 600;
                    font-size: 0.9rem;
                    text-decoration: none;
                    margin-bottom: 2rem;
                    transition: color 0.2s;
                }
                .back-link:hover { color: #4285F4; }

                .hero-title {
                    font-size: clamp(2rem, 5vw, 3rem);
                    font-weight: 700;
                    margin-bottom: 1rem;
                    color: #202124;
                    letter-spacing: -0.02em;
                }

                .hero-subtitle {
                    font-size: 1.15rem;
                    color: #5f6368;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .main-content {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 4rem 1.5rem;
                }

                .bento-section {
                    background: #ffffff;
                    border: 1px solid #dadce0;
                    border-radius: 1rem;
                    padding: 2.5rem;
                    margin-bottom: 2rem;
                    transition: all 0.3s ease;
                }
                .bento-section:hover {
                    border-bottom: 4px solid #4285F4;
                    box-shadow: 0 4px 20px rgba(60,64,67,0.1);
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .icon-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .section-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #202124;
                }

                .section-text {
                    color: #3c4043;
                    font-size: 1.05rem;
                }

                .section-text p { margin-bottom: 1rem; }
                .section-text ul { padding-left: 1.5rem; margin-bottom: 1rem; }
                .section-text li { margin-bottom: 0.5rem; }

                .accent-blue { color: #4285F4; }
                .accent-green { color: #34A853; }
                .accent-yellow { color: #FBBC04; }
                .accent-red { color: #EA4335; }

                .bg-blue { background: #E8F0FE; }
                .bg-green { background: #E6F4EA; }
                .bg-yellow { background: #FFF8E1; }
                .bg-red { background: #FEEBE9; }

                .footer-box {
                    text-align: center;
                    padding: 4rem 1.5rem;
                    background: #202124;
                    color: white;
                    border-radius: 1.5rem;
                    margin-top: 2rem;
                }

                .footer-box h2 { font-size: 1.75rem; margin-bottom: 1rem; }
                .report-btn {
                    display: inline-block;
                    padding: 12px 32px;
                    background: #4285F4;
                    color: white;
                    border-radius: 100px;
                    font-weight: 700;
                    text-decoration: none;
                    margin-top: 1rem;
                    transition: all 0.2s;
                }
                .report-btn:hover { background: #1a73e8; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(66, 133, 244, 0.4); }

                @media (max-width: 768px) {
                    .hero { padding: 4rem 1.5rem; }
                    .bento-section { padding: 1.5rem; }
                }
            `}</style>
            
            <header className="hero">
                <div className="hero-content">
                    <Link href="/" className="back-link">
                        <ArrowLeft size={18} />
                        <span>Back to Home</span>
                    </Link>
                    <h1 className="hero-title">Community Code of <span className="accent-blue">Conduct</span></h1>
                    <p className="hero-subtitle">
                        GDG CUI Wah is dedicated to providing a harassment-free experience for everyone, regardless of gender, sexual orientation, disability, physical appearance, body size, race, or religion.
                    </p>
                </div>
            </header>

            <main className="main-content">
                <section className="bento-section">
                    <div className="section-header">
                        <div className="icon-box bg-blue">
                            <Shield color="#4285F4" size={24} />
                        </div>
                        <h2 className="section-title">Our Pledge</h2>
                    </div>
                    <div className="section-text">
                        <p>
                            In the interest of fostering an open and welcoming environment, we as organizers and members pledge to make participation in our community and our events a harassment-free experience for everyone.
                        </p>
                        <p>
                            We are committed to providing a friendly, safe and welcoming environment for all, regardless of level of experience, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.
                        </p>
                    </div>
                </section>

                <section className="bento-section">
                    <div className="section-header">
                        <div className="icon-box bg-green">
                            <UserCheck color="#34A853" size={24} />
                        </div>
                        <h2 className="section-title">Our Standards</h2>
                    </div>
                    <div className="section-text">
                        <p>Examples of behavior that contributes to creating a positive environment include:</p>
                        <ul>
                            <li>Using welcoming and inclusive language.</li>
                            <li>Being respectful of differing viewpoints and experiences.</li>
                            <li>Gracefully accepting constructive criticism.</li>
                            <li>Focusing on what is best for the community.</li>
                            <li>Showing empathy towards other community members.</li>
                        </ul>
                        <p>Examples of unacceptable behavior by participants include:</p>
                        <ul>
                            <li>The use of sexualized language or imagery and unwelcome sexual attention or advances.</li>
                            <li>Trolling, insulting/derogatory comments, and personal or political attacks.</li>
                            <li>Public or private harassment.</li>
                            <li>Publishing others' private information without explicit permission.</li>
                            <li>Other conduct which could reasonably be considered inappropriate in a professional setting.</li>
                        </ul>
                    </div>
                </section>

                <section className="bento-section">
                    <div className="section-header">
                        <div className="icon-box bg-yellow">
                            <Scale color="#FBBC04" size={24} />
                        </div>
                        <h2 className="section-title">Our Responsibilities</h2>
                    </div>
                    <div className="section-text">
                        <p>
                            Chapter organizers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.
                        </p>
                        <p>
                            Organizers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct, or to ban temporarily or permanently any member for other behaviors that they deem inappropriate, threatening, offensive, or harmful.
                        </p>
                    </div>
                </section>

                <section className="bento-section">
                    <div className="section-header">
                        <div className="icon-box bg-red">
                            <Flag color="#EA4335" size={24} />
                        </div>
                        <h2 className="section-title">Enforcement</h2>
                    </div>
                    <div className="section-text">
                        <p>
                            Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the chapter leads directly or via the reporting button below.
                        </p>
                        <p>
                            All complaints will be reviewed and investigated and will result in a response that is deemed necessary and appropriate to the circumstances. The editorial team is obligated to maintain confidentiality with regard to the reporter of an incident.
                        </p>
                    </div>
                </section>

                <div className="footer-box">
                    <h2>Need to report an incident?</h2>
                    <p>Your safety and comfort are our top priority. All reports are handled strictly and confidentially.</p>
                    <a href="mailto:leads@gdgcuiwah.com" className="report-btn">Report Incident</a>
                </div>
            </main>
        </div>
    );
};

export default CodeOfConduct;
