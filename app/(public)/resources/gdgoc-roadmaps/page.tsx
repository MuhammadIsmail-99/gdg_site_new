"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Rocket } from 'lucide-react';

const GDGoCRoadmapsPage = () => {
    return (
        <div className="cs-root">
            <style>{`
                .cs-root { 
                    font-family: 'Google Sans', sans-serif; 
                    min-height: 100vh; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    background: #fff;
                    padding: 2rem;
                }

                .cs-container {
                    text-align: center;
                    max-width: 600px;
                    width: 100%;
                }

                .logo-boxes {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 3rem;
                }

                .box { width: 32px; height: 32px; border-radius: 8px; }
                .box-red { background: #EA4335; transform: rotate(45deg); opacity: 0.9; }
                .box-blue { background: #4285F4; transform: rotate(-12deg); opacity: 0.9; }
                .box-yellow { background: #FBBC05; transform: rotate(12deg); opacity: 0.9; }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: #fef7e0;
                    color: #b06000;
                    border-radius: 30px;
                    font-size: 14px;
                    font-weight: 700;
                    margin-bottom: 2rem;
                }

                .cs-title {
                    font-size: 3.5rem;
                    font-weight: 700;
                    color: #202124;
                    margin-bottom: 1.5rem;
                    letter-spacing: -0.04em;
                }

                .cs-desc {
                    font-size: 1.125rem;
                    color: #5f6368;
                    line-height: 1.6;
                    margin-bottom: 3rem;
                }

                .back-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    background: #f1f3f4;
                    color: #3c4043;
                    border-radius: 8px;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s;
                }

                .back-btn:hover { background: #e8eaed; transform: translateX(-4px); }

                .floating-icons {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                }
            `}</style>

            <div className="cs-container" data-aos="fade-up">
                <div className="logo-boxes">
                    <div className="box box-red"></div>
                    <div className="box box-blue"></div>
                    <div className="box box-yellow"></div>
                </div>

                <div className="status-badge">
                    <Clock size={16} />
                    Coming Soon
                </div>

                <h1 className="cs-title">Custom Chapter Roadmaps</h1>
                <p className="cs-desc">
                    We're currently crafting bespoke learning paths specifically for CUI Wah students. 
                    These roadmaps will align with your curriculum and help you land high-impact internships.
                </p>

                <Link href="/resources" className="back-btn">
                    <ArrowLeft size={18} />
                    Back to Resources
                </Link>
            </div>
        </div>
    );
};

export default GDGoCRoadmapsPage;
