import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { z } from 'zod'

// ─── GET /api/posts ──────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const page   = Math.max(1, Number(searchParams.get('page')  ?? 1))
    const limit  = Math.min(20, Number(searchParams.get('limit') ?? 6))
    const tag    = searchParams.get('tag')    ?? ''
    const search = searchParams.get('search') ?? ''
    const author = searchParams.get('author') ?? ''
    const skip   = (page - 1) * limit

    const where = {
      isPublished: true,
      ...(tag && {
        tags: { some: { tag: { equals: tag, mode: 'insensitive' as const } } },
      }),
      ...(search && {
        OR: [
          { title:   { contains: search, mode: 'insensitive' as const } },
          { excerpt: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(author && {
        author: { slug: { equals: author, mode: 'insensitive' as const } },
      }),
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          tags:   true,
          author: {
            select: {
              name:     true,
              slug:     true,
              imageUrl: true,
              role:     true,
              tier:     true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      posts,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

// ─── POST /api/posts ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const parsed = z.object({
      title:      z.string().min(5).max(200),
      excerpt:    z.string().max(300).optional(),
      body:       z.string().min(50),
      coverImage: z.string().url().optional().or(z.literal('')),
      tags:       z.array(z.string()).max(5).optional(),
    }).safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const slug = parsed.data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80)
      + '-' + Date.now().toString(36)

    const post = await prisma.post.create({
      data: {
        title:       parsed.data.title,
        slug,
        excerpt:     parsed.data.excerpt ?? '',
        body:        parsed.data.body,
        coverImage:  parsed.data.coverImage ?? '',
        isPublished: false,
        authorId:    session.user.id,
        tags: parsed.data.tags?.length
          ? { create: parsed.data.tags.map(tag => ({ tag })) }
          : undefined,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
