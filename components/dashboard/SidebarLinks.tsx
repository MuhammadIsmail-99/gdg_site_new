'use client'

import Link        from 'next/link'
import { usePathname } from 'next/navigation'

export function SidebarLinks({
  links,
  accentColor,
}: {
  links:       { href: string; label: string; highlight?: boolean }[]
  accentColor: string
}) {
  const pathname = usePathname()

  return (
    <>
      {links.map(link => {
        const isActive = pathname === link.href ||
          (link.href !== '/dashboard' &&
           link.href !== '/core' &&
           link.href !== '/admin' &&
           pathname.startsWith(link.href))

        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display:        'block',
              padding:        '9px 12px',
              borderRadius:   8,
              fontSize:       '0.9rem',
              textDecoration: 'none',
              fontWeight:     isActive ? 600 : link.highlight ? 600 : 400,
              color:          isActive
                                ? accentColor
                                : link.highlight
                                  ? accentColor
                                  : '#202124',
              background:     isActive ? accentColor + '12' : 'transparent',
              transition:     'background 0.15s',
            }}
          >
            {link.label}
          </Link>
        )
      })}
    </>
  )
}
