import { requireRole } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'

export default async function CoreClubsPage() {
  await requireRole(['core', 'admin'])

  const clubs = await prisma.club.findMany({
    include: {
      memberships: {
        include: {
          member: {
            select: {
              id:       true,
              name:     true,
              slug:     true,
              imageUrl: true,
              role:     true,
              tier:     true,
            },
          },
        },
        orderBy: { assignedAt: 'asc' },
      },
      _count: { select: { memberships: true } },
    },
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  })

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
        Club Rosters
      </h1>
      <p style={{ color: '#5F6368', marginBottom: 32, fontSize: '0.9rem' }}>
        Read-only view. To reassign a member, go to their profile in
        Admin → Members.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {clubs.map(club => (
          <div key={club.id} style={{ border: '1px solid #f0f0f0',
            borderRadius: 12, overflow: 'hidden' }}>
            <div style={{
              padding:     '14px 20px',
              background:  (club.colorToken ?? '#4285F4') + '10',
              borderBottom: '1px solid #f0f0f0',
              display:     'flex',
              justifyContent: 'space-between',
              alignItems:  'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%',
                  background: club.colorToken ?? '#4285F4' }} />
                <h3 style={{ fontWeight: 700, margin: 0, fontSize: '1rem' }}>
                  {club.name}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#5F6368',
                  background: '#f1f3f4', padding: '2px 8px',
                  borderRadius: 4 }}>
                  {club.type}
                </span>
              </div>
              <span style={{ fontSize: '0.85rem', color: '#5F6368',
                fontWeight: 500 }}>
                {club._count.memberships}{' '}
                {club._count.memberships === 1 ? 'member' : 'members'}
              </span>
            </div>

            {club.memberships.length === 0 ? (
              <p style={{ padding: '20px', color: '#9AA0A6',
                fontSize: '0.9rem', margin: 0 }}>
                No members assigned yet.
              </p>
            ) : (
              <div style={{ padding: '12px 20px', display: 'flex',
                flexDirection: 'column', gap: 8 }}>
                {club.memberships.map(m => (
                  <div key={m.id} style={{ display: 'flex',
                    alignItems: 'center', gap: 10, padding: '8px 0',
                    borderBottom: '1px solid #f9f9f9' }}>
                    {m.member.imageUrl
                      ? <img src={m.member.imageUrl} alt=""
                          style={{ width: 32, height: 32,
                            borderRadius: '50%', objectFit: 'cover' }} />
                      : <div style={{ width: 32, height: 32,
                          borderRadius: '50%', background: '#E8F0FE',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontWeight: 700,
                          fontSize: '0.8rem', color: '#185FA5' }}>
                          {m.member.name.charAt(0)}
                        </div>
                    }
                    <div style={{ flex: 1 }}>
                      <a href={`/admin/members/${m.member.id}`}
                        style={{ fontWeight: 600, color: '#202124',
                          textDecoration: 'none', fontSize: '0.9rem' }}>
                        {m.member.name}
                      </a>
                      <p style={{ fontSize: '0.75rem', color: '#5F6368',
                        margin: 0 }}>
                        {m.member.tier ?? m.member.role}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#9AA0A6' }}>
                      {new Date(m.assignedAt).toLocaleDateString('en-PK', {
                        month: 'short', year: 'numeric',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
