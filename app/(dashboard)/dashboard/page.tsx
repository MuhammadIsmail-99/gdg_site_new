import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth-guard';
import { getDashboardData } from '@/lib/dashboard';
import { formatMemberId } from '@/lib/utils';

export default async function DashboardPage() {
  const session = await requireAuth();
  const data = await getDashboardData(session.user.id);

  if (!data || !data.member) notFound();

  const role        = data.member.role;
  const isAdmin     = role === 'admin';
  const isCore      = role === 'core' || isAdmin;
  const memberId    = formatMemberId(data.member.id, data.member.createdAt);
  const accentColor = isAdmin ? '#EA4335' : isCore ? '#4285F4' : '#34A853';

  // Personal Stats
  const personalStats = [
    { label: 'Events Attended', value: data.eventsAttended, color: '#4285F4' },
    { label: 'Certificates', value: data.certificatesEarned, color: '#34A853' },
    { label: 'Points', value: data.member.points, color: '#FBBC04' },
  ];

  // Management Stats (if Core/Admin)
  const managementStats = data.managementStats ? [
    { label: 'Total Events',  value: data.managementStats.totalEvents,  href: '/core/events',        color: '#4285F4' },
    { label: 'Active Posts',  value: data.managementStats.totalPosts,   href: '/core/blog',          color: '#34A853' },
    { label: 'Pending Apps',  value: data.managementStats.pendingApps,  href: '/admin/recruitment',  color: '#EA4335' },
    ...(isAdmin ? [{ label: 'Total Members', value: data.managementStats.totalMembers, href: '/admin/members', color: '#B45309' }] : []),
  ] : [];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 4px', color: '#202124' }}>
            Welcome back, {data.member.name}
          </h1>
          <p style={{ color: '#5F6368', margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>
            {memberId} · {data.member.department || (isAdmin ? 'Administrator' : isCore ? 'Core Team' : 'Community Member')}
          </p>
        </div>
        <Link href="/dashboard/profile" style={{
          padding: '10px 20px', borderRadius: 8, background: '#fff',
          border: '1px solid #dadce0', color: '#3C4043',
          fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none'
        }}>
          View Profile
        </Link>
      </div>

      {/* --- Dashboard Grid System --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 32 }}>
        
        {/* Left Column: Personal + Main Stats */}
        <div>
          {/* Section: Personal Activity */}
          <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#5F6368', marginBottom: 12 }}>
            Personal Activity
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            {personalStats.map((stat, i) => (
              <div key={i} style={{
                background: '#fff', border: '1px solid #e8eaed',
                borderRadius: 12, padding: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6368', marginBottom: 4 }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color, margin: 0 }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Section: Management Stats (Only for Core/Admin) */}
          {isCore && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#5F6368', marginBottom: 12 }}>
                Management Hub (Core & Admin)
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                {managementStats.map((stat, i) => (
                  <Link key={i} href={stat.href} style={{
                    background: '#fff', border: '1px solid #e8eaed',
                    borderRadius: 12, padding: '16px 20px', textDecoration: 'none',
                    transition: 'border-color 0.15s, transform 0.1s',
                    display: 'block'
                  }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6368', marginBottom: 4 }}>
                      {stat.label}
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color, margin: 0 }}>
                      {stat.value}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Two-column Activity/News */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
             {/* Recent Events */}
             <div>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6368', marginBottom: 12 }}>Recent Events</h3>
                <div style={{ background: '#fff', border: '1px solid #e8eaed', borderRadius: 12 }}>
                   {data.recentRegistrations.length > 0 ? data.recentRegistrations.map((reg, i) => (
                      <div key={reg.id} style={{
                        padding: '16px 20px',
                        borderBottom: i === data.recentRegistrations.length - 1 ? 'none' : '1px solid #e8eaed',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#202124', margin: 0 }}>{reg.event.title}</p>
                          <p style={{ fontSize: '0.75rem', color: '#5F6368', margin: 0 }}>{new Date(reg.event.date).toLocaleDateString()}</p>
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: reg.attendedAt ? '#1E8E3E' : '#1967D2' }}>{reg.attendedAt ? 'Attended' : 'Joined'}</span>
                      </div>
                   )) : <p style={{ padding: 20, color: '#5F6368', fontSize: '0.85rem' }}>No recent events.</p>}
                </div>
             </div>

             {/* Internal News */}
             <div>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6368', marginBottom: 12 }}>Internal News</h3>
                <div style={{ background: '#fff', border: '1px solid #e8eaed', borderRadius: 12 }}>
                   {data.announcements.length > 0 ? data.announcements.map((a, i) => (
                      <div key={a.id} style={{
                        padding: '16px 20px',
                        borderBottom: i === data.announcements.length - 1 ? 'none' : '1px solid #e8eaed'
                      }}>
                        <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#202124', margin: '0 0 4px' }}>{a.title}</p>
                        <p style={{ fontSize: '0.8rem', color: '#5F6368', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{a.body}</p>
                      </div>
                   )) : <p style={{ padding: 20, color: '#5F6368', fontSize: '0.85rem' }}>No announcements.</p>}
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Mini Tools/Club */}
        <div>
          {/* My Club Pill */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#5F6368', marginBottom: 12 }}>My Chapter Club</h2>
            <div style={{
              padding: '24px', borderRadius: 16, background: data.clubMembership?.club.colorToken ? data.clubMembership.club.colorToken + '10' : '#f8f9fa',
              border: `1px solid ${data.clubMembership?.club.colorToken || '#e8eaed'}`
            }}>
              {data.clubMembership ? (
                <>
                  <p style={{ fontWeight: 800, fontSize: '1.25rem', color: data.clubMembership.club.colorToken || '#202124', margin: '0 0 4px' }}>{data.clubMembership.club.name}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#5F6368' }}>{data.clubMembership.club.type.toUpperCase()}</p>
                </>
              ) : (
                <p style={{ color: '#5F6368', fontSize: '0.85rem', margin: 0 }}>Not assigned to any club yet.</p>
              )}
            </div>
          </div>

          {/* Quick Actions List (Only for items that should be pinned) */}
          {isCore && (
            <div>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6368', marginBottom: 12 }}>Special Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href="/core/announcements" style={{ textDecoration: 'none', color: '#4285F4', fontSize: '0.9rem', padding: '8px 12px', background: '#E8F0FE', border: '1px solid #B4D1FA', borderRadius: 8 }}>Post Announcement</Link>
              </div>
            </div>
          )}
        </div>

      </div>
      <div style={{ height: 60 }} />
    </div>
  );
}
