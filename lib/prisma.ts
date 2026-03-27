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

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Add error handler to pool to prevent process crash
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

// Use a versioned key to force re-initialization if needed
const globalPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

console.log('🔄 Initializing Prisma Client...');

const adapter = new PrismaPg(pool as any)

export const prisma = globalPrisma.prisma ?? new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn']
})

if (process.env.NODE_ENV !== 'production') globalPrisma.prisma = prisma
