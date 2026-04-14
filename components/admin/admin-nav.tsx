'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/team', label: 'Team' },
  { href: '/admin/store', label: 'Store' },
  { href: '/admin/applications', label: 'Applications' },
]

function AdminNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Admin" className="flex flex-wrap gap-2">
      {links.map((l) => {
        const active = pathname === l.href
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm border',
              active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 hover:bg-gray-50'
            )}
          >
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}

export { AdminNav }
export default AdminNav
