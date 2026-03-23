export interface Club {
  id: string
  name: string
  type: string
  colorToken?: string | null
}

export interface ClubMembership {
  club: Club
  assignedAt: Date
}

export interface MemberDetail {
  id: string
  name: string
  slug: string
  email: string
  role: string
  tier?: string | null
  imageUrl?: string | null
  tagline?: string | null
  bio?: string | null
  points: number
  department?: string | null
  linkedin?: string | null
  github?: string | null
  instagram?: string | null
  createdAt: string | Date
  isActive: boolean
  skills: { id: string; skill: string }[]
  contributions: { id: string; title: string; description: string }[]
  clubMemberships?: {
    club: Club
    assignedAt: Date
  } | null
}
