import { requireRole } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'
import { RecruitmentStatusControl } from './RecruitmentStatusControl'
import { ApplicationsTable } from './ApplicationsTable'

export default async function AdminRecruitmentPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string; page?: string }
}) {
  await requireRole(['admin'])

  const page  = Math.max(1, Number(searchParams.page ?? 1))
  const limit = 20
  const skip  = (page - 1) * limit

  const statusFilter = searchParams.status ?? ''
  const searchFilter = searchParams.search ?? ''

  const where = {
    ...(statusFilter && { status: statusFilter }),
    ...(searchFilter && {
      OR: [
        { name:       { contains: searchFilter, mode: 'insensitive' as const } },
        { email:      { contains: searchFilter, mode: 'insensitive' as const } },
        { department: { contains: searchFilter, mode: 'insensitive' as const } },
      ],
    }),
  }

  const [
    applications,
    total,
    pendingCount,
    acceptedCount,
    rejectedCount,
    recruitmentStatus,
    recruitmentMessage,
    recruitmentDeadline,
  ] = await Promise.all([
    prisma.recruitmentApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.recruitmentApplication.count({ where }),
    prisma.recruitmentApplication.count({ where: { status: 'pending'  } }),
    prisma.recruitmentApplication.count({ where: { status: 'accepted' } }),
    prisma.recruitmentApplication.count({ where: { status: 'rejected' } }),
    prisma.siteSetting.findUnique({ where: { key: 'recruitment_status'   } }),
    prisma.siteSetting.findUnique({ where: { key: 'recruitment_message'  } }),
    prisma.siteSetting.findUnique({ where: { key: 'recruitment_deadline' } }),
  ])

  const isOpen = recruitmentStatus?.value === 'open'
  const pages  = Math.ceil(total / limit)

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
        Recruitment Management
      </h1>
      <p style={{ color: '#5F6368', marginBottom: 24, fontSize: '0.9rem' }}>
        Review applications, manage recruitment status, and convert accepted applicants into members.
      </p>

      {/* Status control section */}
      <RecruitmentStatusControl
        isOpen={isOpen}
        message={recruitmentMessage?.value  ?? ''}
        deadline={recruitmentDeadline?.value ?? ''}
      />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16, margin: '24px 0' }}>
        {[
          { label: 'Total Apps', value: pendingCount + acceptedCount + rejectedCount, color: '#4285F4', text: '#185FA5', bg: '#E8F0FE' },
          { label: 'Pending',    value: pendingCount,  color: '#FBBC04', text: '#B45309', bg: '#FEF7E0' },
          { label: 'Accepted',   value: acceptedCount, color: '#34A853', text: '#137333', bg: '#E6F4EA' },
          { label: 'Rejected',   value: rejectedCount, color: '#EA4335', text: '#A32D2D', bg: '#FEEBE9' },
        ].map(stat => (
          <div key={stat.label} style={{ background: stat.bg,
            padding: '20px 24px', borderRadius: 12,
            border: `1px solid ${stat.color}40`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <p style={{ fontSize: '0.75rem', color: stat.text, margin: '0 0 4px',
              textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 800,
              color: stat.text, margin: 0 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters + table */}
      <ApplicationsTable
        applications={applications}
        total={total}
        pages={pages}
        currentPage={page}
        statusFilter={statusFilter}
        searchFilter={searchFilter}
      />
    </div>
  )
}
