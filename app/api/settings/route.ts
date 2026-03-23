import { NextResponse } from 'next/server'
import { prisma }       from '@/lib/prisma'

// Only these keys are safe to expose publicly
const PUBLIC_KEYS = [
  'instagram_url',
  'linkedin_url',
  'twitter_url',
  'github_url',
  'website_url',
  'chapter_email',
]

export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: PUBLIC_KEYS } },
    })

    const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]))
    return NextResponse.json(settings)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}
