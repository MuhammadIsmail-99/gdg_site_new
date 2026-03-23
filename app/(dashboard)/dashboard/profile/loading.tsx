import React from 'react';

export default function DashboardLoading() {
  const pulseStyle = { animation: 'pulse 1.5s infinite', background: '#f5f5f5' };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: 40 }}>
        <div style={{ height: 32, width: 250, ...pulseStyle, borderRadius: 8, marginBottom: 12 }} />
        <div style={{ height: 20, width: 300, ...pulseStyle, borderRadius: 6 }} />
      </header>

      <main>
        {/* Stats Skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 100, ...pulseStyle, borderRadius: 12 }} />
          ))}
        </div>

        {/* Big Card Skeleton */}
        <div style={{ height: 120, ...pulseStyle, borderRadius: 12, marginBottom: 32 }} />

        {/* Grid Skeletons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
          {[1, 2].map(i => (
            <div key={i} style={{ height: 200, ...pulseStyle, borderRadius: 12 }} />
          ))}
        </div>

        {/* Resources Skeleton */}
        <div style={{ height: 180, ...pulseStyle, borderRadius: 12 }} />
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}} />
    </div>
  );
}
