import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import RegisterForm from './RegisterForm'
import { EventDetail } from '@/types/event'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function RegisterPage({ params }: Props) {
  const { slug } = await params
  const session = await auth() // Freshly synchronized session check

  if (!session?.user) {
    redirect(`/login?callbackUrl=/events/${slug}/register`)
  }

  const event = await prisma.event.findFirst({
    where: { slug: slug, isPublished: true },
    include: {
      tags: true,
      _count: { select: { registrations: true } },
      agendaItems: { orderBy: { order: 'asc' } }
    }
  })

  if (!event) {
    notFound()
  }

  // Double check if already registered
  const existingRegistration = await prisma.eventRegistration.findUnique({
    where: {
      eventId_memberId: {
        eventId: event.id,
        memberId: session.user.id!
      }
    }
  })

  if (existingRegistration) {
    // We could either redirect to dashboard or show a "Already Registered" state
    // For now, allow the form to render but maybe logic in form handles it
    // Actually, redirecting or showing success is better.
  }

  const member = await prisma.member.findUnique({
    where: { id: session.user.id! },
    select: { phoneNumber: true }
  })

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
      <RegisterForm 
        event={event as unknown as EventDetail} 
        user={{
          id: session.user.id!,
          name: session.user.name || 'Member',
          email: session.user.email || '',
          phoneNumber: member?.phoneNumber || null
        }} 
      />
    </main>
  )
}
