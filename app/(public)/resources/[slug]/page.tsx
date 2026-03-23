"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, Play, Book, Code, CheckCircle2 } from 'lucide-react';

const trackData: any = {
    'web-dev': {
        title: 'Web Development',
        tagline: 'Modern Web Engineering',
        color: '#4285F4',
        heroDesc: 'Go from creating simple websites to building complex, high-performance web applications using React, Next.js, and Full-stack Node.js environments.',
        curriculum: [
            {
                phase: 'Phase 1: Foundations',
                topics: [
                    { title: 'HTML5 & Semantic Markup', resource: 'MDN Web Docs', type: 'doc' },
                    { title: 'CSS3: Flexbox & Grid Mastery', resource: 'Josh Comeau Guide', type: 'guide' },
                    { title: 'JavaScript (ES6+ basics)', resource: 'JavaScript.info', type: 'course' }
                ]
            },
            {
                phase: 'Phase 2: Modern Library',
                topics: [
                    { title: 'React.js Component Architecture', resource: 'Official React Docs', type: 'doc' },
                    { title: 'State Management (Zustand/Redux)', resource: 'Level Up Tutorials', type: 'video' },
                    { title: 'Responsive Design with Tailwind CSS', resource: 'Tailwind Labs', type: 'guide' }
                ]
            },
            {
                phase: 'Phase 3: Production Ready',
                topics: [
                    { title: 'Server-Side Rendering with Next.js', resource: 'Next.js App Router Mastery', type: 'course' },
                    { title: 'Full-stack Integration (Node/Fastify)', resource: 'FullStackOpen', type: 'course' },
                    { title: 'CI/CD & Vercel Deployment', resource: 'GitHub Actions Guide', type: 'guide' }
                ]
            }
        ]
    },
    'ai-ml': {
        title: 'AI / Machine Learning',
        tagline: 'Intelligence thru Data',
        color: '#EA4335',
        heroDesc: 'Explore the mathematical foundations of AI, master data analysis with Python, and build your first neural networks using TensorFlow and Keras.',
        curriculum: [
            {
                phase: 'Phase 1: Math & Python',
                topics: [
                    { title: 'Calculus and Linear Algebra for ML', resource: 'MIT OpenCourseWare', type: 'course' },
                    { title: 'Python for Data Analysis (NumPy/Pandas)', resource: 'DataCamp Basics', type: 'course' }
                ]
            },
            {
                phase: 'Phase 2: Core ML Algorithms',
                topics: [
                    { title: 'Regression & Classification', resource: 'Supervised Learning Course', type: 'course' },
                    { title: 'Feature Engineering & Clustering', resource: 'Kaggle Tutorials', type: 'guide' }
                ]
            },
            {
                phase: 'Phase 3: Deep Learning & NLP',
                topics: [
                    { title: 'Neural Networks with TensorFlow', resource: 'DeepLearning.ai', type: 'course' },
                    { title: 'Natural Language Processing (Gemini)', resource: 'Google Cloud Skills', type: 'workshop' }
                ]
            }
        ]
    },
    'dsa': {
        title: 'DSA Mastery',
        tagline: 'Elite Logic & Performance',
        color: '#34A853',
        heroDesc: 'Crack the interview and master the logic. Learn to write efficient, clean, and scalable code by mastering complex data structures and algorithms.',
        curriculum: [
            {
                phase: 'Phase 1: Basics',
                topics: [
                    { title: 'Big O Notation & Time Complexity', resource: 'Interview Cake', type: 'guide' },
                    { title: 'Linear DS: Arrays, Linked Lists, Stacks', resource: 'GeeksForGeeks', type: 'doc' }
                ]
            },
            {
                phase: 'Phase 2: Non-Linear DS',
                topics: [
                    { title: 'Trees & Binary Search Trees (BST)', resource: 'LeetCode Explore', type: 'doc' },
                    { title: 'Graphs: BFS, DFS, Dijkstra', resource: 'Visualgo.net', type: 'tool' }
                ]
            },
            {
                phase: 'Phase 3: Optimization',
                topics: [
                    { title: 'Dynamic Programming Patterns', resource: 'Aditya Verma Playlist', type: 'video' },
                    { title: 'Greedy Algorithms', resource: 'Competitive Coding Hub', type: 'guide' }
                ]
            }
        ]
    },
    'cloud-devops': {
        title: 'Cloud & DevOps',
        tagline: 'Reliable Infrastructure',
        color: '#FBBC05',
        heroDesc: 'Modern infrastructure management. Master Docker containers, Google Cloud Platform (GCP), and end-to-end CI/CD pipelines.',
        curriculum: [
            {
                phase: 'Phase 1: Cloud Basics',
                topics: [
                    { title: 'Linux Command Line Mastery', resource: 'Linux Journey', type: 'guide' },
                    { title: 'GCP Fundamentals', resource: 'Google Cloud Training', type: 'doc' }
                ]
            },
            {
                phase: 'Phase 2: Virtualization',
                topics: [
                    { title: 'Docker: Containers & Images', resource: 'Docker Handbook', type: 'doc' },
                    { title: 'Kubernetes (GKE)', resource: 'K8s Official Docs', type: 'doc' }
                ]
            },
            {
                phase: 'Phase 3: Automation',
                topics: [
                    { title: 'Jenkins/GitHub Actions', resource: 'DevOps Handbook', type: 'guide' },
                    { title: 'Infrastructure as Code (Terraform)', resource: 'HashiCorp Learn', type: 'course' }
                ]
            }
        ]
    },
    'ui-ux': {
        title: 'UI/UX Design',
        tagline: 'User-Centric Excellence',
        color: '#A142F4',
        heroDesc: 'Master the art of design. From low-fidelity wireframes to high-fidelity prototypes and complete design systems.',
        curriculum: [
            {
                phase: 'Phase 1: Design Thinking',
                topics: [
                    { title: 'User Research & Personas', resource: 'Nielson Norman Group', type: 'doc' },
                    { title: 'Information Architecture', resource: 'Interaction Design Found', type: 'doc' }
                ]
            },
            {
                phase: 'Phase 2: Visual Mastery',
                topics: [
                    { title: 'Typography & Color Theory', resource: 'Material 3 Design', type: 'guide' },
                    { title: 'Figma Auto-Layout & Variants', resource: 'Figma Academy', type: 'video' }
                ]
            },
            {
                phase: 'Phase 3: Professional Work',
                topics: [
                    { title: 'Component Libraries & Design Systems', resource: 'Atlassian Design System', type: 'guide' },
                    { title: 'Case Study Building', resource: 'ADPList Professional Guides', type: 'guide' }
                ]
            }
        ]
    }
};

const TrackDetailPage = () => {
    const params = useParams();
    const slug = params.slug as string;
    const track = trackData[slug];

    if (!track) return (
        <div style={{ padding: '10rem', textAlign: 'center' }}>
            <h2>Track Not Found</h2>
            <Link href="/resources">Back to Resources</Link>
        </div>
    );

    return (
        <div className="track-root">
            <style>{`
                .track-root { font-family: 'Google Sans', sans-serif; background: #fff; min-height: 100vh; }
                
                .hero {
                    padding: 6rem 2rem;
                    background: #f8f9fa;
                    border-bottom: 1px solid #eee;
                    position: relative;
                }

                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: #5f6368;
                    font-size: 14px;
                    margin-bottom: 3rem;
                    text-decoration: none;
                }
                .back-link:hover { color: #202124; transform: translateX(-4px); }
                .back-link { transition: all 0.2s; }

                .hero-content { max-width: 800px; }
                .track-tag { font-size: 14px; font-weight: 700; color: ${track.color}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; display: block; }
                .hero-title { font-size: 4rem; font-weight: 700; color: #202124; margin-bottom: 1.5rem; letter-spacing: -0.04em; }
                .hero-desc { font-size: 1.25rem; color: #5f6368; line-height: 1.6; }

                .main-section { max-width: 1200px; margin: 0 auto; padding: 6rem 2rem; }
                
                .phase-section { margin-bottom: 4rem; }
                .phase-header { 
                    padding-bottom: 1rem; 
                    border-bottom: 2px solid #f1f3f4; 
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .phase-header h2 { font-size: 24px; font-weight: 700; color: #202124; }
                
                .topic-grid { display: grid; gap: 16px; }
                .topic-card {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px;
                    background: #fff;
                    border: 1px solid #eee;
                    border-radius: 16px;
                    transition: all 0.2s;
                }
                .topic-card:hover { border-color: ${track.color}; transform: scale(1.01); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

                .topic-info h3 { font-size: 16px; font-weight: 700; margin-bottom: 4px; color: #202124; }
                .topic-info p { font-size: 13px; color: #5f6368; }

                .type-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    padding: 4px 10px;
                    background: #f1f3f4;
                    border-radius: 30px;
                    color: #5f6368;
                }
            `}</style>

            <header className="hero">
                <div className="container">
                    <Link href="/resources" className="back-link">
                        <ArrowLeft size={16} />
                        Back to Resources
                    </Link>
                    <div className="hero-content" data-aos="fade-up">
                        <span className="track-tag">{track.tagline}</span>
                        <h1 className="hero-title">{track.title}</h1>
                        <p className="hero-desc">{track.heroDesc}</p>
                    </div>
                </div>
            </header>

            <main className="main-section">
                {track.curriculum.map((phase: any, i: number) => (
                    <section key={i} className="phase-section" data-aos="fade-up">
                        <div className="phase-header">
                            <CheckCircle2 size={24} color={track.color} />
                            <h2>{phase.phase}</h2>
                        </div>
                        <div className="topic-grid">
                            {phase.topics.map((topic: any, j: number) => (
                                <a key={j} href="#" className="topic-card">
                                    <div className="topic-info">
                                        <div className="type-badge">
                                            {topic.type === 'video' ? <Play size={10} /> : <Book size={10} />}
                                            {topic.type}
                                        </div>
                                        <h3 style={{ marginTop: '8px' }}>{topic.title}</h3>
                                        <p>Primary Resource: {topic.resource}</p>
                                    </div>
                                    <ExternalLink size={20} color="#dadce0" />
                                </a>
                            ))}
                        </div>
                    </section>
                ))}
            </main>
        </div>
    );
};

export default TrackDetailPage;
