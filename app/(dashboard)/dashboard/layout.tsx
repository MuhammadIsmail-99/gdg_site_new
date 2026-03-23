import { requireAuth }    from '@/lib/auth-guard'
import DashboardLayout    from '@/components/dashboard/DashboardLayout'
import { getNavLinks }    from '@/lib/nav-links'

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAuth()
  const role    = session.user.role

  return (
    <DashboardLayout
      panelLabel={role === 'admin' ? 'Admin Panel' : role === 'core' ? 'Core Panel' : 'My Dashboard'}
      accentColor={role === 'admin' ? '#EA4335' : role === 'core' ? '#4285F4' : '#34A853'}
      navLinks={getNavLinks(role)}
      user={{
        name:     session.user.name ?? 'Member',
        role:     role,
        imageUrl: session.user.imageUrl ?? null,
      }}
    >
      {children}
    </DashboardLayout>
  )
}
