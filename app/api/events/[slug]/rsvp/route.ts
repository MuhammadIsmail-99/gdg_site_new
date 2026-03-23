import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/auth'
import { prisma }  from '@/lib/prisma'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = await prisma.event.findUnique({
      where:  { slug: slug, isPublished: true },
      select: { id: true, date: true },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (new Date(event.date) < new Date()) {
      return NextResponse.json(
        { error: 'Registration is closed for past events.' },
        { status: 400 }
      )
    }

    const existing = await prisma.eventRegistration.findUnique({
      where: {
        eventId_memberId: {
          eventId:  event.id,
          memberId: session.user.id,
        },
      },
    })

    if (existing) {
      await prisma.eventRegistration.delete({ where: { id: existing.id } })
      const count = await prisma.eventRegistration.count({
        where: { eventId: event.id },
      })
      return NextResponse.json({ registered: false, count })
    } else {
      await prisma.eventRegistration.create({
        data: { eventId: event.id, memberId: session.user.id },
      })
      const count = await prisma.eventRegistration.count({
        where: { eventId: event.id },
      })
      return NextResponse.json({ registered: true, count })
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to process RSVP' }, { status: 500 })
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await auth()

    const event = await prisma.event.findUnique({
      where:  { slug: slug, isPublished: true },
      select: {
        id:    true,
        date:  true,
        _count: { select: { registrations: true } },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const registered = session?.user
      ? !!(await prisma.eventRegistration.findUnique({
          where: {
            eventId_memberId: {
              eventId:  event.id,
              memberId: session.user.id,
            },
          },
        }))
      : false

    const isPast = new Date(event.date) < new Date()

    return NextResponse.json({
      registered,
      count:  event._count.registrations,
      isPast,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to check RSVP' }, { status: 500 })
  }
}
