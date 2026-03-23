import React from 'react';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import styles from '../Dashboard.module.css';
import { Calendar, MapPin, ChevronLeft, ArrowRight } from 'lucide-react';

export default async function MyEventsPage() {
  const session = await requireAuth();
  const memberId = session.user.id;

  const registrations = await prisma.eventRegistration.findMany({
    where:   { memberId },
    include: {
      event: {
        include: { tags: true },
      },
    },
    orderBy: { event: { date: 'desc' } },
  });

  return (
    <div className={styles.dashboardRoot}>
      <header className={styles.hero} style={{ padding: '6rem 1.5rem 3rem 1.5rem' }}>
        <div className={styles.heroContent}>
           <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--g-text-sub)', textDecoration: 'none', marginBottom: '1.5rem', fontWeight: 500, fontSize: '0.9rem' }}>
              <ChevronLeft size={18} /> Back to Dashboard
           </Link>
           <h1 className={styles.heroTitle}>My <span>Events</span></h1>
           <p className={styles.heroSubtitle}>
              Manage your event registrations and view your participation history.
           </p>
        </div>
      </header>

      <main className={styles.container} style={{ marginTop: '3rem' }}>
        {registrations.length === 0 ? (
          <div className={styles.bentoCard} style={{ textAlign: 'center', padding: '4rem' }}>
            <Calendar size={48} color="var(--g-blue)" style={{ margin: '0 auto 1.5rem auto', opacity: 0.3 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No events found</h3>
            <p style={{ color: 'var(--g-text-sub)', marginBottom: '2rem' }}>You haven't registered for any events yet.</p>
            <Link href="/events" className={styles.linkCard} style={{ background: 'var(--g-blue)', color: 'white', border: 'none', padding: '12px 24px' }}>
               Explore Events
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {registrations.map((reg) => {
              const date = new Date(reg.event.date);
              const isPast = date < new Date();
              const badge = reg.attendedAt 
                ? { label: 'Attended', class: styles.badgeGreen }
                : isPast 
                  ? { label: 'Did not attend', class: styles.badgeGray }
                  : { label: 'Registered', class: styles.badgeBlue };

              return (
                <div key={reg.id} className={styles.bentoCard} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem' }}>
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '12px', 
                        background: '#f8f9fa', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: '1px solid #e0e0e0'
                      }}>
                       <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--g-red)', textTransform: 'uppercase' }}>{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                       <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{date.getDate()}</span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.2rem', margin: '0 0 4px 0' }}>{reg.event.title}</h3>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '0.85rem', color: 'var(--g-text-sub)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                           <MapPin size={14} /> {reg.event.location}
                        </span>
                        <span className={`${styles.badge} ${badge.class}`} style={{ fontSize: '0.75rem' }}>
                           {badge.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                     <Link href={`/events/${reg.event.slug}`} className={styles.linkCard} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                        Event Details <ArrowRight size={14} />
                     </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
