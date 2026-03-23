import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/auth'
import { prisma }  from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = req.nextUrl
    const status = searchParams.get('status') ?? ''
    const search = searchParams.get('search') ?? ''
    const page   = Math.max(1, Number(searchParams.get('page') ?? 1))
    const limit  = 20
    const skip   = (page - 1) * limit

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { name:       { contains: search, mode: 'insensitive' as const } },
          { email:      { contains: search, mode: 'insensitive' as const } },
          { department: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    }

    const [applications, total] = await Promise.all([
      prisma.recruitmentApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.recruitmentApplication.count({ where }),
    ])

    return NextResponse.json({
      applications,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
