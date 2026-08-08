import { Link, useNavigate } from 'react-router-dom'

import { CheckCircleIcon } from '@/components/icons'
import { Logo } from '@/components/Logo'
import { APP_TAGLINE, CURRENT_YEAR } from '@/lib/brand'

import { useAuth } from '../hooks/useAuth'
import { LoginForm } from './LoginForm'

const HIGHLIGHTS = [
  'One console for consent, rights, and case management',
  'Every action lands in an immutable audit trail',
  'Statutory deadlines tracked automatically, not in a spreadsheet',
]

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoggingIn, loginError } = useAuth()

  const handleSubmit = async (input: { email: string; password: string }) => {
    try {
      await login(input)
      navigate('/admin')
    } catch {
      // stay on the form; loginError is already tracked reactively below
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <Logo variant="light" size="md" to="/" />

        <div className="relative">
          <p className="text-3xl font-semibold leading-tight">{APP_TAGLINE}</p>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3 text-sm text-indigo-100">
                <CheckCircleIcon width={18} height={18} className="mt-0.5 shrink-0 text-indigo-200" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-indigo-200">© {CURRENT_YEAR} Consentra. All rights reserved.</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-16 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo size="lg" />
          </div>

          <h1 className="text-lg font-semibold text-neutral-900">Staff sign in</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Sign in to manage consent, requests, and your workspace.
          </p>

          <div className="mt-6">
            <LoginForm
              onSubmit={handleSubmit}
              isSubmitting={isLoggingIn}
              errorMessage={loginError ? 'Invalid email or password.' : null}
            />
          </div>

          <Link
            to="/"
            className="mt-8 block text-center text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
