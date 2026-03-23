import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const search = searchParams.get('search') ?? ''
    const type   = searchParams.get('type')   ?? ''
    const topic  = searchParams.get('topic')  ?? ''
    const date   = searchParams.get('date')   ?? ''
    const page   = Math.max(1, Number(searchParams.get('page') ?? 1))
    const limit  = Math.min(50, Number(searchParams.get('limit') ?? 10))
    const skip   = (page - 1) * limit

    const where = {
      isPublished: true,
      ...(search && {
        OR: [
          { title:       { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(type  && { type:  { equals: type,  mode: 'insensitive' as const } }),
      ...(topic && { tags:  { some: { tag: { equals: topic, mode: 'insensitive' as const } } } }),
      ...(date  && {
        date: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lt:  new Date(`${date}T23:59:59.999Z`),
        },
      }),
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          tags:          true,
          _count: { select: { registrations: true } },
        },
        orderBy: { date: 'asc' },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ])

    return NextResponse.json({
      events,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
