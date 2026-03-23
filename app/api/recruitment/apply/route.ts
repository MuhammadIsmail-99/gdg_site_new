import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z }      from 'zod'

const applicationSchema = z.object({
  name:       z.string().min(2).max(100),
  email:      z.string().email(),
  studentId:  z.string().min(3).max(20).optional().or(z.literal('')),
  department: z.string().min(2).max(100),
  domains:    z.array(z.string()).min(1, 'Select at least one domain of interest.'),
  statement:  z.string().min(50, 'Statement must be at least 50 characters.').max(1000),
})

export async function POST(req: NextRequest) {
  try {
    // Check recruitment status first
    const statusRow = await prisma.siteSetting.findUnique({
      where: { key: 'recruitment_status' },
    })

    if (!statusRow || statusRow.value !== 'open') {
      return NextResponse.json(
        { error: 'Applications are currently closed.' },
        { status: 403 }
      )
    }

    const body   = await req.json()
    const parsed = applicationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input.', issues: parsed.error.issues },
        { status: 400 }
      )
    }

    // Check for duplicate email
    const existing = await prisma.recruitmentApplication.findFirst({
      where: { email: parsed.data.email },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'You have already applied.' },
        { status: 409 }
      )
    }

    const application = await prisma.recruitmentApplication.create({
      data: {
        name:       parsed.data.name,
        email:      parsed.data.email,
        studentId:  parsed.data.studentId || null,
        department: parsed.data.department,
        domains:    parsed.data.domains.join(','),
        statement:  parsed.data.statement,
        status:     'pending',
      },
    })

    return NextResponse.json(
      { success: true, id: application.id },
      { status: 201 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to submit application.' },
      { status: 500 }
    )
  }
}
