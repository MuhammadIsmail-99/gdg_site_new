import { requireRole } from '@/lib/auth-guard'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  RoleBadge,
  StatusBadge,
  ResetPasswordButton,
  ToggleStatusButton,
  DeleteMemberButton,
  MarkAttendedButton
} from '../MemberTableComponents'
import { ClubAssignmentControl } from '../components/ClubAssignmentControl'

export default async function AdminMemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireRole(['admin'])

  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      skills: true,
      contributions: true,
      eventRegistrations: {
        include: { event: { select: { title: true, slug: true, date: true } } },
        orderBy: { event: { date: 'desc' } },
        take: 10,
      },
      clubMemberships: {
        include: { club: { select: { id: true, name: true, type: true } } },
      },
      _count: {
        select: { eventRegistrations: true },
      },
    },
  })

  const allClubs = await prisma.club.findMany({ 
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true, type: true }
  })

  if (!member) notFound()

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Back link */}
      <Link href="/admin/members"
        style={{
          color: '#5F6368', fontSize: '0.85rem',
          textDecoration: 'none', display: 'block', marginBottom: 24
        }}>
        ← Back to members
      </Link>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        marginBottom: 32, paddingBottom: 24,
        borderBottom: '1px solid #f0f0f0'
      }}>
        {member.imageUrl
          ? <img src={member.imageUrl} alt=""
            style={{
              width: 72, height: 72, borderRadius: '50%',
              objectFit: 'cover'
            }} />
          : <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: '#E8F0FE', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: '1.5rem',
            color: '#185FA5'
          }}>
            {member.name.charAt(0)}
          </div>
        }
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
            {member.name}
          </h1>
          <p style={{ color: '#5F6368', margin: '4px 0 0' }}>
            {member.email}
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <RoleBadge role={member.role} />
            {member.tier && (
              <span style={{
                background: '#f1f3f4', color: '#202124',
                padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600
              }}>
                {member.tier}
              </span>
            )}
            <StatusBadge isActive={member.isActive} />
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Link href={`/admin/members/${member.id}/edit`}
            style={{
              background: '#4285F4', color: '#fff',
              padding: '8px 16px', borderRadius: 8,
              textDecoration: 'none', fontWeight: 600,
              fontSize: '0.875rem'
            }}>
            Edit
          </Link>
        </div>
      </div>

      {/* Info grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 16, marginBottom: 32
      }}>
        {[
          { label: 'Student ID', value: member.studentId ?? '—' },
          { label: 'Department', value: member.department ?? '—' },
          { label: 'Points', value: String(member.points) },
          { label: 'Events', value: String(member._count.eventRegistrations) },
          { label: 'Member Since', value: new Date(member.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }) },
          { label: 'LinkedIn', value: member.linkedin ?? '—' },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: '#fafafa',
            padding: '12px 16px', borderRadius: 8
          }}>
            <p style={{
              fontSize: '0.75rem', color: '#5F6368',
              margin: '0 0 4px', textTransform: 'uppercase',
              fontWeight: 600, letterSpacing: '.04em'
            }}>
              {label}
            </p>
            <p style={{ margin: 0, fontWeight: 500, wordBreak: 'break-word' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Club Assignment */}
      <div style={{ marginBottom: 32, padding: '16px 20px',
        background: '#fafafa', borderRadius: 12,
        border: '1px solid #f0f0f0' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>
          Club Assignment
        </h3>

        {(() => {
          const membership = (member as any).clubMemberships;
          const item = Array.isArray(membership) ? membership[0] : membership;
          const club = item?.club;
          if (!club) return (
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <p style={{ color: '#5F6368', margin: 0, fontSize: '0.9rem' }}>
                No club assigned yet.
              </p>
              <ClubAssignmentControl
                memberId={id}
                currentClubId={null}
                allClubs={allClubs}
              />
            </div>
          );
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>
                  {club.name}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#5F6368', margin: '4px 0 0' }}>
                  {club.type === 'technical' ? 'Technical Track' : 'Creative Track'} ·{' '}
                  Assigned {new Date(item.assignedAt).toLocaleDateString('en-PK', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
              <ClubAssignmentControl
                memberId={id}
                currentClubId={item.clubId}
                allClubs={allClubs}
              />
            </div>
          );
        })()}
      </div>

      {/* Skills */}
      {member.skills.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>
            Skills
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {member.skills.map(s => (
              <span key={s.id} style={{
                background: '#E8F0FE',
                color: '#185FA5', padding: '4px 12px',
                borderRadius: 100, fontSize: '0.8rem', fontWeight: 500
              }}>
                {s.skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent event registrations */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>
          Recent Events ({member._count.eventRegistrations} total)
        </h3>
        {member.eventRegistrations.length === 0
          ? <p style={{ color: '#5F6368', fontSize: '0.9rem' }}>No events yet.</p>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {member.eventRegistrations.map(reg => {
                const isPast = new Date(reg.event.date) < new Date();
                return (
                  <div key={reg.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px', background: '#fafafa',
                    borderRadius: 8
                  }}>
                    <Link href={`/events/${reg.event.slug}`}
                      style={{
                        fontWeight: 500, color: '#202124',
                        textDecoration: 'none'
                      }}>
                      {reg.event.title}
                    </Link>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#5F6368' }}>
                        {new Date(reg.event.date).toLocaleDateString('en-PK')}
                      </span>
                      {reg.attendedAt ? (
                        <span style={{
                          background: '#E6F4EA', color: '#137333',
                          padding: '2px 8px', borderRadius: 4,
                          fontSize: '0.75rem', fontWeight: 600,
                        }}>
                          Attended
                        </span>
                      ) : (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{
                            background: '#f1f3f4', color: '#5F6368',
                            padding: '2px 8px', borderRadius: 4,
                            fontSize: '0.75rem', fontWeight: 600,
                          }}>
                            Registered
                          </span>
                          {isPast && <MarkAttendedButton registrationId={reg.id} />}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }
      </div>

      {/* Danger zone */}
      <div style={{
        borderTop: '1px solid #f0f0f0', paddingTop: 24,
        marginTop: 32
      }}>
        <h3 style={{
          fontSize: '1rem', fontWeight: 700, color: '#EA4335',
          marginBottom: 16
        }}>
          Danger Zone
        </h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <ResetPasswordButton memberId={member.id} />
          <ToggleStatusButton
            memberId={member.id}
            isActive={member.isActive}
          />
          <DeleteMemberButton memberId={member.id} name={member.name} />
        </div>
      </div>
    </div>
  )
}
