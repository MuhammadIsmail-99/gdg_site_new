import { requireRole } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'
import { notFound }    from 'next/navigation'
import EventForm       from '../../new/EventForm'

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireRole(['core', 'admin'])

  const event = await prisma.event.findUnique({
    where:   { id },
    include: { tags: true, agendaItems: { orderBy: { order: 'asc' } } },
  })

  if (!event) notFound()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Edit Event</h1>
      </div>
      <EventForm event={event} mode="edit" />
    </div>
  )
}
