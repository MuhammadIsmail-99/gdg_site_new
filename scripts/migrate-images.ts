import { createClient } from '@supabase/supabase-js'
import { PrismaClient }  from '@prisma/client'
import { Pool }          from 'pg'
import { PrismaPg }      from '@prisma/adapter-pg'
import * as fs           from 'fs'
import * as path         from 'path'
import 'dotenv/config'

const connectionString = `${process.env.DATABASE_URL}`
const pool    = new Pool({ connectionString })
const adapter = new PrismaPg(pool as any)
const prisma  = new PrismaClient({ adapter })

const supabase  = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const members = await prisma.member.findMany({
    where: {
      imageUrl: { not: null },
    },
    select: { id: true, slug: true, imageUrl: true },
  })

  for (const member of members) {
    const url = member.imageUrl!

    // Skip if already a full URL (already on Supabase or external)
    if (url.startsWith('http')) {
      console.log(`SKIP ${member.slug} — already a URL`)
      continue
    }

    // Skip base64
    if (url.startsWith('data:')) {
      console.log(`SKIP ${member.slug} — base64, upload manually via profile`)
      continue
    }

    // Local path like /images/team/ubaid.jpg
    const localPath = path.join(process.cwd(), 'public', url)

    if (!fs.existsSync(localPath)) {
      console.log(`MISSING ${member.slug} — file not found: ${localPath}`)
      continue
    }

    const buffer   = fs.readFileSync(localPath)
    const ext      = path.extname(url).slice(1) || 'jpg'
    const mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`
    const dest     = `avatars/${member.id}.${ext}`

    const { error } = await supabase
      .storage
      .from('member-avatars')
      .upload(dest, buffer, { contentType: mimeType, upsert: true })

    if (error) {
      console.error(`FAIL ${member.slug} — ${error.message}`)
      continue
    }

    const { data } = supabase
      .storage
      .from('member-avatars')
      .getPublicUrl(dest)

    await prisma.member.update({
      where: { id: member.id },
      data:  { imageUrl: data.publicUrl },
    })

    console.log(`OK ${member.slug} → ${data.publicUrl}`)
  }

  await prisma.$disconnect()
}

main().catch(console.error)
