import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'

interface LoginFormProps {
  onSubmit: (input: { email: string; password: string }) => void
  isSubmitting: boolean
  errorMessage?: string | null
}

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
      <Field label="Email" htmlFor="login-email">
        <Input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field label="Password" htmlFor="login-password">
        <Input
          id="login-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
