import { requireRole } from '@/lib/auth-guard'
import EventForm       from './EventForm'

export default async function NewEventPage() {
  await requireRole(['core', 'admin'])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>New Event</h1>
      </div>

      <EventForm mode="create" />
    </div>
  )
}
