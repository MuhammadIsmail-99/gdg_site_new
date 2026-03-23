import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const event = await prisma.event.findFirst({
      where:   { slug, isPublished: true },
      include: {
        tags:        true,
        agendaItems: { orderBy: { order: 'asc' } },
        _count: { select: { registrations: true } },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}
