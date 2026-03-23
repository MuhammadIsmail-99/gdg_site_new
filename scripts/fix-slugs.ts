import { PrismaClient } from '@prisma/client'
import { Pool }          from 'pg'
import { PrismaPg }      from '@prisma/adapter-pg'
import 'dotenv/config'

const connectionString = `${process.env.DATABASE_URL}`
const pool    = new Pool({ connectionString })
const adapter = new PrismaPg(pool as any)
const prisma  = new PrismaClient({ adapter })

async function main() {
  const fixes = [
    { old: 'adeel', new: 'adeel-asghar' },
    { old: 'kashif-ayub', new: 'kashif-ayyub' },
    { old: 'ismail', new: 'muhammad-ismail' },
    { old: 'm-yousaf', new: 'muhammad-yousaf' },
    { old: 'ubaid', new: 'ubaid-ghazi' },
  ]

  for (const fix of fixes) {
    await prisma.member.update({
      where: { slug: fix.old },
      data:  { slug: fix.new },
    })
    console.log(`FIXED: ${fix.old} -> ${fix.new}`)
  }

  await prisma.$disconnect()
  process.exit(0)
}

main().catch(console.error)
