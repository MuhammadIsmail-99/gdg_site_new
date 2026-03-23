import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rows = await prisma.postTag.findMany({
      distinct: ['tag'],
      select:   { tag: true },
      orderBy:  { tag: 'asc' },
    })
    return NextResponse.json(rows.map(r => r.tag))
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}
