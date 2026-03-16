import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function AccountPage() {
  const { user, logout } = useAuth()

  return (
    <div className="max-w-lg mx-auto py-12 sm:py-16 px-4">
      <h1 className="font-serif text-3xl text-secondary mb-6">Minha conta</h1>
      <p className="text-secondary/90 mb-2">Olá, {user?.name || user?.email}.</p>
      <p className="text-secondary/90 mb-8"><strong>Email:</strong> {user?.email}</p>
      <button
        type="button"
        onClick={logout}
        className="px-6 py-3 border border-neutral text-secondary font-medium text-sm hover:bg-neutral-light/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
      >
        Sair
      </button>
      <p className="mt-8">
        <Link to="/" className="text-primary hover:text-accent font-medium text-sm transition-colors">
          Início
        </Link>
      </p>
    </div>
  )
}
