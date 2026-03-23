import React from 'react';

interface AbstractIllustrationProps {
  id: string;
  color: string;
}

export function AbstractIllustration({ id, color }: AbstractIllustrationProps) {
  const style: React.CSSProperties = { opacity: 0.1, color: color, pointerEvents: 'none' };
  const baseClass = "illustration-svg";
  
  switch (id) {
    case 'c1': // Web Development - Connectivity and Layout
      return (
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" style={style} className={`${baseClass} web-dev-svg`}>
          <rect x="40" y="60" width="320" height="200" rx="12" stroke="currentColor" strokeWidth="2"/>
          <circle cx="80" cy="90" r="10" fill="currentColor"/>
          <circle cx="110" cy="90" r="10" fill="currentColor" fillOpacity="0.5"/>
          <path d="M40 130H360M120 130V260" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="150" y="160" width="180" height="12" rx="6" fill="currentColor" fillOpacity="0.3"/>
          <rect x="150" y="190" width="140" height="12" rx="6" fill="currentColor" fillOpacity="0.3"/>
        </svg>
      );
    case 'c2': // Machine Learning - Cognitive Patterns
      return (
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" style={style} className={`${baseClass} ml-svg`}>
          <path d="M200 50 L350 150 L350 300 L200 400 L50 300 L50 150 Z" stroke="currentColor" strokeWidth="1"/>
          <circle cx="200" cy="225" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10"/>
          <path d="M200 145V305M120 225H280" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5"/>
          <circle cx="200" cy="225" r="20" fill="currentColor"/>
        </svg>
      );
    case 'c3': // App Development - Touch & Interface
      return (
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" style={style} className={`${baseClass} app-dev-svg`}>
          <rect x="120" y="40" width="160" height="320" rx="40" stroke="currentColor" strokeWidth="3"/>
          <circle cx="200" cy="320" r="15" stroke="currentColor" strokeWidth="2"/>
          <path d="M160 100H240" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.2"/>
          <rect x="145" y="140" width="110" height="80" rx="10" fill="currentColor" fillOpacity="0.1"/>
        </svg>
      );
    case 'c4': // UI/UX Design - Precision & Flow
      return (
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" style={style} className={`${baseClass} ui-ux-svg`}>
          <path d="M50 200 Q 200 50 350 200 T 50 350" stroke="currentColor" strokeWidth="3" fill="none"/>
          <rect x="180" y="180" width="40" height="40" stroke="currentColor" strokeWidth="2" transform="rotate(45 200 200)"/>
          <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5"/>
        </svg>
      );
    case 'c5': // Content - Propagation & Reach
      return (
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" style={style} className={`${baseClass} content-svg`}>
          <circle cx="50" cy="200" r="20" fill="currentColor"/>
          <path d="M80 180 Q 200 100 350 200" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
          <path d="M100 220 Q 220 300 370 220" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4"/>
          <circle cx="300" cy="120" r="10" fill="currentColor" fillOpacity="0.6"/>
        </svg>
      );
    case 'c6': // Cloud - Infinite Layers
      return (
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" style={style} className={`${baseClass} cloud-svg`}>
          <path d="M100 250 H300 V300 H100 Z" fill="currentColor" fillOpacity="0.2"/>
          <path d="M120 200 H280 V250 H120 Z" fill="currentColor" fillOpacity="0.4"/>
          <path d="M140 150 H260 V200 H140 Z" fill="currentColor" fillOpacity="0.6"/>
          <path d="M180 100 H220 V150 H180 Z" fill="currentColor"/>
        </svg>
      );
    default:
      return null;
  }
}
