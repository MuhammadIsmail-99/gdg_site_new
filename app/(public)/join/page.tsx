import { JoinClosed } from './JoinClosed'
import { JoinOpen }   from './JoinOpen'

// ─── Data fetchers ────────────────────────────────────────────────────────────

async function getRecruitmentStatus(): Promise<{
  isOpen:   boolean
  message:  string
  deadline: string | null
}> {
  const res = await fetch(
    `${process.env.AUTH_URL ?? 'http://localhost:3000'}/api/recruitment/status`,
    { cache: 'no-store' }
  )
  if (!res.ok) return { isOpen: false, message: 'Applications are currently closed.', deadline: null }
  return res.json()
}

async function getSiteSettings(): Promise<Record<string, string>> {
  const res = await fetch(
    `${process.env.AUTH_URL ?? 'http://localhost:3000'}/api/settings`,
    { cache: 'no-store' }
  )
  return res.ok ? res.json() : {}
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata = {
  title: 'Join GDGoC CUI Wah | Apply to the Core Team',
  description:
    'Apply to join the Google Developer Groups on Campus – CUI Wah chapter. Be part of a community that learns, builds, and grows together.',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function JoinPage() {
  const [status, settings] = await Promise.all([
    getRecruitmentStatus(),
    getSiteSettings(),
  ])

  return status.isOpen
    ? <JoinOpen  deadline={status.deadline} settings={settings} />
    : <JoinClosed message={status.message}  settings={settings} />
}
