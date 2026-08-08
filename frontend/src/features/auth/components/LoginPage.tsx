import { useNavigate } from 'react-router-dom'

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
    <main className="mx-auto max-w-sm p-8">
      <h1 className="mb-6 text-center text-xl font-semibold">Staff sign in</h1>
      <LoginForm
        onSubmit={handleSubmit}
        isSubmitting={isLoggingIn}
        errorMessage={loginError ? 'Invalid email or password.' : null}
      />
    </main>
  )
}
