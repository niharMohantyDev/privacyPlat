import { Link, useNavigate } from 'react-router-dom'

import { Card } from '@/components/ui/Card'
import { Logo } from '@/components/Logo'

import { useAuth } from '../hooks/useAuth'
import { LoginForm } from './LoginForm'

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-6 dark:bg-neutral-950">
      <Logo size="lg" className="mb-8" />
      <Card className="w-full max-w-sm">
        <h1 className="text-center text-lg font-semibold text-neutral-900 dark:text-white">Staff sign in</h1>
        <p className="mt-1 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Sign in to manage consent, requests, and your workspace.
        </p>
        <div className="mt-6">
          <LoginForm
            onSubmit={handleSubmit}
            isSubmitting={isLoggingIn}
            errorMessage={loginError ? 'Invalid email or password.' : null}
          />
        </div>
      </Card>
      <Link
        to="/"
        className="mt-8 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
      >
        ← Back to home
      </Link>
    </div>
  )
}
