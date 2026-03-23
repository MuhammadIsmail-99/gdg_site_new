import { NextRequest, NextResponse } from 'next/server'
import { prisma }                  from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const member = await prisma.member.findUnique({
      where: { slug },
      select: {
        id:            true,
        name:          true,
        slug:          true,
        email:         true,
        role:          true,
        tier:          true,
        imageUrl:      true,
        tagline:       true,
        bio:           true,
        points:        true,
        department:    true,
        linkedin:      true,
        github:        true,
        instagram:     true,
        createdAt:     true,
        isActive:      true,
        skills:        { select: { id: true, skill: true } },
        contributions: true,
        clubMemberships: {
          include: { club: { select: { id: true, name: true, type: true, colorToken: true } } },
          take: 1,
        },
      },
    })

    if (!member || !member.isActive) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json(member)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
