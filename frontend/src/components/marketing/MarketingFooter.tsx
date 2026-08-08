import { Link } from 'react-router-dom'

import { Logo } from '@/components/Logo'
import { APP_TAGLINE, CURRENT_YEAR } from '@/lib/brand'

const FOOTER_COLUMNS = [
  {
    heading: 'Product',
    links: [
      { to: '/demo', label: 'Consent banner demo' },
      { to: '/rights', label: 'DSAR portal demo' },
      { to: '/admin/login', label: 'Staff sign in' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { to: '/terms', label: 'Terms of Service' },
      { to: '/privacy', label: 'Privacy Policy' },
    ],
  },
]

export function MarketingFooter() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <Logo size="sm" />
            <p className="mt-3 max-w-xs text-sm text-neutral-500">{APP_TAGLINE}</p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-semibold text-neutral-900">{column.heading}</h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-neutral-500 hover:text-neutral-900">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-neutral-200 pt-6 text-sm text-neutral-500">
          © {CURRENT_YEAR} Consentra. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
