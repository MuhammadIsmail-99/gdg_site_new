import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [typeRows, tagRows] = await Promise.all([
      prisma.event.findMany({
        where:   { isPublished: true },
        select:  { type: true },
        distinct: ['type'],
      }),
      prisma.eventTag.findMany({
        distinct: ['tag'],
        select:   { tag: true },
      }),
    ])

    return NextResponse.json({
      types:  typeRows.map(r => r.type),
      topics: tagRows.map(r => r.tag),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch meta' }, { status: 500 })
  }
}
