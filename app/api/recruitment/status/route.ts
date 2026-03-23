import { NextResponse } from 'next/server'
import { prisma }       from '@/lib/prisma'

export async function GET() {
  try {
    const [statusRow, messageRow, deadlineRow] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: 'recruitment_status'  } }),
      prisma.siteSetting.findUnique({ where: { key: 'recruitment_message' } }),
      prisma.siteSetting.findUnique({ where: { key: 'recruitment_deadline'} }),
    ])

    return NextResponse.json({
      isOpen:   (statusRow?.value  ?? 'closed') === 'open',
      message:  messageRow?.value  ?? 'Applications are currently closed.',
      deadline: deadlineRow?.value ? deadlineRow.value : null,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 })
  }
}
