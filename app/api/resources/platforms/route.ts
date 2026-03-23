import { NextResponse } from 'next/server'
import { prisma }       from '@/lib/prisma'

export async function GET() {
  try {
    const platforms = await prisma.resourcePlatform.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(platforms)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to fetch platforms' },
      { status: 500 }
    )
  }
}
