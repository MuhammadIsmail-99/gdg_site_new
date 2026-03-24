import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  if (process.env.NODE_ENV === 'production' && !process.env.CI) {
    console.warn('⚠️ DATABASE_URL is not set in production environment.')
  }
}

const pool = new Pool({ connectionString })

// Add error handler to pool to prevent process crash
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter, log: ['query'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
