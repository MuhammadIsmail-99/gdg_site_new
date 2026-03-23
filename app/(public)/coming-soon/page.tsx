import React from 'react';
import { ArrowLeft,Rocket } from 'lucide-react';

export default function ComingSoonPage() {
    return (
        <div className="coming-soon-container">
            <style>{`
                .coming-soon-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #ffffff;
                    color: #202124;
                    padding: 2rem;
                    font-family: 'Google Sans Text', sans-serif;
                }

                .rocket-box {
                    width: 80px;
                    height: 80px;
                    background: #f8f9fa;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 2rem;
                    color: #4285F4;
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .title {
                    font-family: 'Product Sans', sans-serif;
                    font-size: clamp(2.5rem, 8vw, 4rem);
                    font-weight: 700;
                    margin-bottom: 1rem;
                    text-align: center;
                    letter-spacing: -0.02em;
                }

                .subtitle {
                    font-size: 1.25rem;
                    color: #5f6368;
                    max-width: 500px;
                    text-align: center;
                    line-height: 1.6;
                    margin-bottom: 3rem;
                }

                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0.75rem 1.5rem;
                    border: 1px solid #dadce0;
                    border-radius: 100px;
                    font-weight: 600;
                    color: #202124;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .back-btn:hover {
                    background: #f8f9fa;
                    transform: translateX(-4px);
                    border-color: #bdc1c6;
                }
            `}</style>

            <div className="rocket-box">
                <Rocket size={40} />
            </div>

            <h1 className="title">Coming <span style={{ color: '#34A853' }}>Soon</span></h1>
            <p className="subtitle">
                We're building something amazing! Our club project showcases are currently under development. Stay tuned for some incredible innovation.
            </p>

            <a href="/clubs" className="back-btn">
                <ArrowLeft size={18} /> Back to Clubs
            </a>
        </div>
    );
}
