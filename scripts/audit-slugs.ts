import { PrismaClient } from '@prisma/client'
import { Pool }          from 'pg'
import { PrismaPg }      from '@prisma/adapter-pg'
import 'dotenv/config'

const connectionString = `${process.env.DATABASE_URL}`
const pool    = new Pool({ connectionString })
const adapter = new PrismaPg(pool as any)
const prisma  = new PrismaClient({ adapter })

async function main() {
  const members = await prisma.member.findMany({
    select: { id: true, name: true, slug: true, isActive: true },
    orderBy: { name: 'asc' },
  })

  console.log('\n=== Member Slugs ===')
  members.forEach(m => {
    const expected = m.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
    // Check if it starts with first 10 chars of expected or matches closely
    const matches = m.slug.startsWith(expected.slice(0, 10)) || m.slug === expected
    console.log(`${matches ? 'OK' : 'MISMATCH'} | ${m.slug} | ${m.name} | expected approx: ${expected}`)
  })

  // Check for duplicate slugs
  const slugs = members.map(m => m.slug)
  const dupes  = slugs.filter((s, i) => slugs.indexOf(s) !== i)
  if (dupes.length > 0) {
    console.log('\n=== DUPLICATE SLUGS (must fix) ===')
    dupes.forEach(d => console.log(d))
  } else {
    console.log('\nNo duplicate slugs found.')
  }

  await prisma.$disconnect()
  process.exit(0)
}

main().catch(console.error)
