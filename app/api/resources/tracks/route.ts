import { NextResponse } from 'next/server'
import { prisma }       from '@/lib/prisma'

export async function GET() {
  try {
    const tracks = await prisma.resourceTrack.findMany({
      include: {
        steps: { orderBy: { order: 'asc' } },
      },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(tracks)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to fetch tracks' },
      { status: 500 }
    )
  }
}
