import { prisma } from '@/lib/prisma'
import EventsCarouselClient from './EventsCarouselClient'
import { EventSummary } from '@/types/event'

async function getFeaturedEvents(): Promise<EventSummary[]> {
  try {
    const events = await prisma.event.findMany({
      where:   { isPublished: true },
      include: { 
        tags: true,
        _count: { select: { registrations: true } }
      },
      orderBy: { date: 'desc' },
      take:    4,
    })

    return events as unknown as EventSummary[]
  } catch (error) {
    console.warn('Could not fetch featured events:', error)
    return []
  }
}

export default async function EventsCarousel() {
  const events = await getFeaturedEvents()
  return <EventsCarouselClient events={events} />
}
