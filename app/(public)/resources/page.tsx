import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import type {
  ResourceTrack,
  ResourcePlatform,
  ResourceToolCategory,
} from '@/types/resources';

async function getResourcesData() {
  const [tracks, platforms, toolCategories] = await Promise.all([
    prisma.resourceTrack.findMany({
      include: { steps: { orderBy: { order: 'asc' } } },
      orderBy: { name: 'asc' },
    }),
    prisma.resourcePlatform.findMany({
      orderBy: { order: 'asc' },
    }),
    prisma.resourceToolCategory.findMany({
      include: { tools: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    }),
  ]) as unknown as [ResourceTrack[], ResourcePlatform[], ResourceToolCategory[]];
  return { tracks, platforms, toolCategories };
}

export default async function ResourcesPage() {
  const { tracks, platforms, toolCategories } = await getResourcesData();

  // Hero stats — derive from DB counts
  const trackCount = tracks.length;
  const toolCount = toolCategories.reduce(
    (sum, cat) => sum + cat.tools.length, 0
  );

  return (
    <div className="res-root">
      <style>{`
        :root {
          --g-blue: #4285F4;
          --g-red: #EA4335;
          --g-yellow: #FBBC04;
          --g-green: #34A853;
          --g-gray: #5F6368;
          --g-bg: #ffffff;
          --g-text-main: #202124;
          --g-text-sub: #5F6368;
          --section-gap: 10rem;
          --border-light: #e0e0e0;
        }

        .res-root {
          font-family: 'Google Sans Text', sans-serif;
          background-color: var(--g-bg);
          color: var(--g-text-main);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        h1, h2, h3, h4 {
          font-family: 'Product Sans', 'Google Sans', sans-serif;
          letter-spacing: -0.02em;
        }

        /* --- THE UNIFIED HERO COMPONENT --- */
        .hero {
          padding: 8rem 1.5rem 4rem 1.5rem;
          position: relative;
          overflow: hidden;
          background: white;
          border-bottom: 1px solid #e0e0e0;
        }

        .hero::before {
          content: "";
          position: absolute;
          top: -150px;
          right: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(66, 133, 244, 0.15) 0%, transparent 70%);
          z-index: 0;
          border-radius: 50%;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          text-align: left;
        }

        .hero-breadcrumb {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--g-text-sub);
          margin-bottom: 1.25rem;
        }

        .hero-breadcrumb .dot-sep {
          width: 4px;
          height: 4px;
          background: #dadce0;
          border-radius: 50%;
        }

        .hero-title {
          font-family: 'Product Sans', sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          line-height: 1.1;
          margin-bottom: 1rem;
          color: var(--g-text-main);
          letter-spacing: -0.02em;
        }

        .hero-title span { 
          color: var(--g-blue);
        }

        .hero-subtitle {
          font-size: 1.15rem;
          color: var(--g-text-sub);
          max-width: 650px;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--g-gray);
          font-weight: 500;
          padding: 6px 14px;
          background: #f8f9fa;
          border-radius: 100px;
        }

        .meta-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        @media (max-width: 768px) {
          .hero { padding: 6rem 1.5rem 4rem 1.5rem; }
          .hero-title { font-size: 2.5rem; }
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .section { margin-bottom: var(--section-gap); }

        .section-header {
          margin: 6rem 0 4rem;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 2rem;
        }

        .section-title { font-size: 3rem; font-weight: 700; }

        .path-row {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 4rem;
          margin-bottom: 6rem;
          position: relative;
        }

        @media (max-width: 850px) {
          .path-row { grid-template-columns: 1fr; gap: 1.5rem; }
        }

        .path-meta {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .path-tag {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 4px;
          text-transform: uppercase;
          margin-bottom: 1rem;
          display: inline-block;
        }

        .path-title { font-size: 2rem; margin-bottom: 1rem; }

        .path-steps {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
        }

        @media (max-width: 600px) {
          .path-steps { grid-template-columns: 1fr; }
        }

        .step-item { position: relative; }

        .step-num {
          font-family: 'Product Sans';
          font-size: 0.85rem;
          color: var(--g-text-sub);
          margin-bottom: 0.5rem;
          display: block;
        }

        .step-name { font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem; }
        .step-desc { font-size: 0.95rem; color: var(--g-text-sub); }

        .platform-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 3rem;
        }

        .platform-item { 
          flex: 1; 
          min-width: 200px;
          text-decoration: none;
          color: inherit;
          display: block;
          padding: 1rem;
          border-radius: 12px;
          transition: background 0.3s;
        }
        .platform-item:hover { background: #f8f9fa; }

        .platform-name {
          font-family: 'Product Sans';
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: color 0.3s;
        }

        .platform-name:hover { color: var(--g-blue); }

        .platform-name::after {
          content: "↗";
          font-size: 1rem;
          opacity: 0.3;
        }

        .platform-info { font-size: 0.9rem; color: var(--g-text-sub); }

        .toolbox-layout {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 4rem;
        }

        @media (max-width: 850px) { .toolbox-layout { grid-template-columns: 1fr; } }

        .tool-group h4 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

        .tool-link-list { list-style: none; }

        .tool-link-item {
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #f5f5f5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }

        .tool-link-item:hover { 
          border-color: var(--g-blue); 
          padding-left: 8px;
          color: var(--g-blue);
        }

        .tool-link-item span:last-child {
          font-size: 0.8rem;
          color: #bdc1c6;
          text-transform: uppercase;
          font-weight: 700;
        }

        .big-footer {
          padding: 4rem 0;
          background: var(--g-blue);
          border-top: none;
          margin-top: 5rem;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        @media (max-width: 850px) {
          .footer-content { flex-direction: column; align-items: flex-start; gap: 2rem; }
        }

        .cta-text {
          font-size: 3rem;
          line-height: 1.1;
          font-weight: 700;
          max-width: 600px;
          color: white;
        }

        .cta-btn {
          background: white;
          color: var(--g-blue);
          padding: 1.25rem 2.5rem;
          border-radius: 100px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.05rem;
          transition: transform 0.3s;
        }

        .cta-btn:hover {
          transform: scale(1.05);
          background: #f8f9fa;
        }
      `}</style>

      <header className="hero" data-aos="fade-up">
        <div className="hero-content">
          <nav className="hero-breadcrumb">
            <span>GDGOC</span> <span className="dot-sep"></span> <span>Library</span> <span className="dot-sep"></span> <span style={{ color: "var(--g-blue)" }}>Resources</span>
          </nav>
          <h1 className="hero-title">Curated <span>Knowledge</span> for every developer.</h1>
          <p className="hero-subtitle">From roadmaps to documentation, find everything you need to bridge the gap between theory and industry-scale impact.</p>
          <div className="hero-meta">
            <div className="meta-item"><span className="meta-dot" style={{ background: "var(--g-blue)" }}></span> {trackCount} Learning Tracks</div>
            <div className="meta-item"><span className="meta-dot" style={{ background: "var(--g-yellow)" }}></span> {toolCount}+ Verified Tools</div>
          </div>
        </div>
      </header>

      <main className="container">

        {/* Tracks Section */}
        <section className="section">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">Core Tracks</h2>
          </div>

          {tracks.map(track => (
            <div key={track.id} className="path-row" data-aos="fade-up">
              <aside className="path-meta">
                <span
                  className="path-tag"
                  style={{
                    background: track.tagColor + '20',
                    color: track.tagColor,
                  }}
                >
                  {track.tag}
                </span>
                <h3 className="path-title">{track.name}</h3>
                <p className="step-desc">{track.description}</p>
              </aside>
              <div className="path-steps">
                {track.steps.map(step => (
                  <div key={step.id} className="step-item">
                    <span className="step-num">{step.stepNum}</span>
                    <h4 className="step-name">{step.title}</h4>
                    <p className="step-desc">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* External Platforms */}
        <section className="section">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">Learning Hubs</h2>
          </div>
          <div className="platform-list" data-aos="fade-up">
            {platforms.map(platform => (
              <a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="platform-item"
              >
                <div className="platform-name">{platform.name}</div>
                <p className="platform-info">{platform.description}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Toolbox */}
        <section className="section">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">The Toolbox</h2>
          </div>
          <div className="toolbox-layout" data-aos="fade-up">
            {toolCategories.map(cat => (
              <div key={cat.id} className="tool-group">
                <h4>
                  <span
                    className="dot"
                    style={{ background: cat.colorHex }}
                  />
                  {cat.name}
                </h4>
                <div className="tool-link-list">
                  {cat.tools.map(tool => (
                    tool.url ? (
                      <a
                        key={tool.id}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tool-link-item"
                        style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <span>{tool.name}</span>
                        <span>{tool.toolType}</span>
                      </a>
                    ) : (
                      <div key={tool.id} className="tool-link-item" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', cursor: 'default' }}>
                        <span>{tool.name}</span>
                        <span>{tool.toolType}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* CTA Footer */}
      <footer className="big-footer">
        <div className="container footer-content">
          <div className="cta-text">
            Ready to start <br />
            your journey?
          </div>
          <Link href="/join" className="cta-btn">Join the Chapter</Link>
        </div>
      </footer>
    </div>
  );
}
