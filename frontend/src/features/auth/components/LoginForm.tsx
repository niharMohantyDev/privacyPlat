import { useState } from 'react'

import { Button } from '@/components/ui/Button'

interface LoginFormProps {
  onSubmit: (input: { email: string; password: string }) => void
  isSubmitting: boolean
  errorMessage?: string | null
}

const INPUT_CLASSES =
  'mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-900'

/** Presentational only — see apps/consent's ConsentBanner for the same convention. */
export function LoginForm({ onSubmit, isSubmitting, errorMessage }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.trim() || !password) return
    onSubmit({ email: email.trim(), password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={INPUT_CLASSES}
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={INPUT_CLASSES}
        />
      </div>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
