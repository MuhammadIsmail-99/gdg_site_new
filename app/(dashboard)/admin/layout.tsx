import { requireRole }    from '@/lib/auth-guard'
import DashboardLayout    from '@/components/dashboard/DashboardLayout'
import { getNavLinks }    from '@/lib/nav-links'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireRole(['admin'])
  const role    = session.user.role

  return (
    <DashboardLayout
      panelLabel="Admin Panel"
      accentColor="#EA4335"
      navLinks={getNavLinks(role)}
      user={{
        name:     session.user.name ?? 'Admin',
        role:     role,
        imageUrl: session.user.imageUrl ?? null,
      }}
    >
      {children}
    </DashboardLayout>
  )
}
