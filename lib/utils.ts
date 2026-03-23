export function formatMemberId(memberId: string, createdAt: Date): string {
  const year    = new Date(createdAt).getFullYear()
  const suffix  = memberId.slice(-6).toUpperCase()
  return `GDG-${year}-${suffix}`
}
