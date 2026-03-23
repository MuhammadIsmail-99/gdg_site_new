import { requireRole }    from '@/lib/auth-guard'
import DashboardLayout    from '@/components/dashboard/DashboardLayout'
import { getNavLinks }    from '@/lib/nav-links'

export default async function CoreDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireRole(['core', 'admin'])
  const role    = session.user.role

  return (
    <DashboardLayout
      panelLabel={role === 'admin' ? 'Admin Panel' : 'Core Panel'}
      accentColor={role === 'admin' ? '#EA4335' : '#4285F4'}
      navLinks={getNavLinks(role)}
      user={{
        name:     session.user.name  ?? 'Core Member',
        role:     role,
        imageUrl: session.user.imageUrl ?? null,
      }}
    >
      {children}
    </DashboardLayout>
  )
}
