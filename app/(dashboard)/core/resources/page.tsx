import { requireRole } from '@/lib/auth-guard'
import { prisma }      from '@/lib/prisma'
import ResourcesManager from './ResourcesManager'

export default async function CoreResourcesPage() {
  await requireRole(['core', 'admin'])

  const [tracks, platforms, toolCategories] = await Promise.all([
    prisma.resourceTrack.findMany({
      include: { steps: { orderBy: { order: 'asc' } } },
      orderBy: { name: 'asc' },
    }),
    prisma.resourcePlatform.findMany({ orderBy: { order: 'asc' } }),
    prisma.resourceToolCategory.findMany({
      include: { tools: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    }),
  ]) as any[]

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
        Resources
      </h1>
      <p style={{ color: '#5F6368', marginBottom: 32 }}>
        Manage learning tracks, platforms, and tools shown on /resources.
      </p>

      <ResourcesManager
        tracks={tracks}
        platforms={platforms}
        toolCategories={toolCategories}
      />
    </div>
  )
}
