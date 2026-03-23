import Link from 'next/link';
import styles from './HeroStrap.module.css';

export default function HeroStrap() {
  return (
    <div className={styles.strap} data-aos="fade-up">
      <div className={styles.container}>
        <Link href="/clubs" className="btn-primary" style={{ borderRadius: '4px', padding: '8px 20px', fontSize: '14px' }}>
          Explore Clubs
        </Link>
      </div>
    </div>
  );
}
