import { Link } from 'react-router-dom'

import { Logo } from '@/components/Logo'
import { LinkButton } from '@/components/ui/LinkButton'

const NAV_LINKS = [
  { to: '/#features', label: 'Product' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#testimonials', label: 'Customers' },
]

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />
        <nav className="hidden gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/login"
            className="text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          >
            Sign in
          </Link>
          <LinkButton to="/demo" size="sm">
            View live demo
          </LinkButton>
        </div>
      </div>
    </header>
  )
}
