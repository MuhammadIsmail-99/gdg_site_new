import { NextResponse } from 'next/server'
import { prisma }       from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.resourceToolCategory.findMany({
      include: {
        tools: { orderBy: { order: 'asc' } },
      },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(categories)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    )
  }
}
