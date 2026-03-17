import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const IconMail = () => (
  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2 7l8.97 5.7a1.94 1.94 0 002.06 0L22 7" />
    <rect width="20" height="14" x="2" y="3" rx="2" />
  </svg>
)

const IconLock = () => (
  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)

const IconAlert = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, isAuthenticated, getErrorMessage } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/account'

  if (isAuthenticated) {
    navigate(from, { replace: true })
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex-1 min-h-0 flex items-center justify-center px-4 py-4 sm:py-6 md:py-8 bg-gradient-to-b from-primary/[0.04] via-surface to-primary/10 overflow-hidden">
      <div
        className="w-full max-w-md max-h-full rounded-2xl border border-neutral-light/90 bg-surface-elevated shadow-xl shadow-secondary/10 backdrop-blur-md transition-colors duration-200 motion-reduce:backdrop-blur-none overflow-y-auto"
        style={{ padding: 'clamp(1rem, 4vw, 2.5rem)' }}
      >
        <div className="flex-shrink-0">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-secondary mb-1 sm:mb-2">
            Entrar
          </h1>
          <p className="text-secondary/80 text-xs sm:text-sm mb-4 sm:mb-6">
            Acesse sua conta do Ateliê da Cássia
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none" aria-hidden>
                <IconMail />
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3 border border-neutral-light bg-background text-secondary placeholder-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">
              Senha
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral pointer-events-none" aria-hidden>
                <IconLock />
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full pl-11 pr-4 py-3 border border-neutral-light bg-background text-secondary placeholder-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
              />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-accent text-sm"
            >
              <IconAlert />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-xl bg-accent text-background font-medium text-sm tracking-wide hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200"
          >
            {submitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="mt-4 sm:mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-primary font-medium text-sm hover:text-accent cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
          >
            Voltar ao início
          </Link>
        </p>
      </div>
    </div>
  )
}
