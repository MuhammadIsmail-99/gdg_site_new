export interface NavLink {
  href: string;
  label: string;
  highlight?: boolean;
}

export const getNavLinks = (role: string): NavLink[] => {
  const isAdmin = role === 'admin'
  const isCore = role === 'core' || isAdmin

  const links: NavLink[] = [
    // --- PERSONAL ---
    { href: '/dashboard', label: 'Personal Overview' },
    { href: '/dashboard/events', label: 'My Events' },
    { href: '/dashboard/id-card', label: 'Member ID' },
    { href: '/dashboard/profile', label: 'My Profile' },
    { href: '/dashboard/profile/security', label: 'Security' },

    // --- EXPLORE ---
    { href: '/blog/new', label: '+ Write a Post', highlight: true },
  ]

  // --- MANAGEMENT (CORE + ADMIN) ---
  if (isCore) {
    links.push(
      { href: '/core/events', label: 'Manage Events' },
      { href: '/core/blog', label: 'Manage Posts' },
      { href: '/core/announcements', label: 'Announcements' },
      { href: '/core/resources', label: 'Manage Resources' },
      { href: '/core/clubs', label: 'Club Rosters' },
    )
  }

  // --- ADMINISTRATION ---
  if (isAdmin) {
    links.push(
      { href: '/admin', label: 'Admin Overview' },
      { href: '/admin/members', label: 'Member Directory' },
      { href: '/admin/recruitment', label: 'Hiring Pipeline' },
      { href: '/admin/settings', label: 'Site Config' },
    )
  }

  return links
}
