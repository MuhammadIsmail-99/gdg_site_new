'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function registerForEvent(eventId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'You must be logged in to register.' }
  } // Secure session check with updated schema

  try {
    const existing = await prisma.eventRegistration.findUnique({
      where: {
        eventId_memberId: {
          eventId,
          memberId: session.user.id
        }
      }
    })

    if (existing) {
      return { error: 'You are already registered for this event.' }
    }

    await prisma.eventRegistration.create({
      data: {
        eventId,
        memberId: session.user.id
      }
    })

    revalidatePath(`/events`)
    revalidatePath(`/dashboard`)
    
    return { success: true }
  } catch (error) {
    console.error('Registration Error:', error)
    return { error: 'Failed to register. Please try again later.' }
  }
}
