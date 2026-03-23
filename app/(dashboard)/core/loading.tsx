import React from 'react';
import styles from './Dashboard.module.css';

export default function DashboardLoading() {
  return (
    <div className={styles.dashboardRoot}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div style={{ height: 20, width: 200, background: '#f0f0f0', borderRadius: 4, marginBottom: 20, animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: 48, width: 400, background: '#f0f0f0', borderRadius: 8, marginBottom: 16, animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: 24, width: 500, background: '#f0f0f0', borderRadius: 8, animation: 'pulse 1.5s infinite' }} />
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.bentoGrid}>
          {/* Stats Skeleton */}
          <div className={`${styles.bentoCard} ${styles['col-span-8']}`} style={{ animation: 'pulse 1.5s infinite' }}>
            <div style={{ height: 24, width: 150, background: '#f0f0f0', borderRadius: 4, marginBottom: 24 }} />
            <div className={styles.statsGrid}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: 80, background: '#f8f9fa', borderRadius: 12 }} />
              ))}
            </div>
          </div>

          {/* Quick Links Skeleton */}
          <div className={`${styles.bentoCard} ${styles['col-span-4']}`} style={{ animation: 'pulse 1.5s infinite' }}>
            <div style={{ height: 24, width: 120, background: '#f0f0f0', borderRadius: 4, marginBottom: 24 }} />
            <div className={styles.linksGrid}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ height: 40, background: '#f8f9fa', borderRadius: 12 }} />
              ))}
            </div>
          </div>

          {/* List Skeletons */}
          {[1, 2].map(i => (
            <div key={i} className={`${styles.bentoCard} ${styles['col-span-6']}`} style={{ animation: 'pulse 1.5s infinite' }}>
              <div style={{ height: 24, width: 150, background: '#f0f0f0', borderRadius: 4, marginBottom: 24 }} />
              <div style={{ height: 100, background: '#f8f9fa', borderRadius: 12 }} />
            </div>
          ))}

          {/* Resource Skeleton */}
          <div className={`${styles.bentoCard} ${styles['col-span-12']}`} style={{ animation: 'pulse 1.5s infinite' }}>
            <div style={{ height: 24, width: 200, background: '#f0f0f0', borderRadius: 4, marginBottom: 24 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: 60, background: '#f8f9fa', borderRadius: 12 }} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
