import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useCart } from '../contexts/CartContext.jsx'

export default function Header() {
  const { isAuthenticated } = useAuth()
  const { count } = useCart()

  return (
    <header className="bg-background border-b border-neutral-light/80 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-6 py-5 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="font-serif text-xl sm:text-2xl font-semibold text-secondary tracking-tight hover:text-primary transition-colors"
        >
          Ateliê da Cássia
        </Link>
        <div className="flex items-center gap-8">
          <Link
            to="/products"
            className="text-sm font-medium text-secondary hover:text-accent transition-colors hidden sm:block"
          >
            Coleção
          </Link>
          <Link
            to="/cart"
            className="text-sm font-medium text-secondary hover:text-accent transition-colors flex items-center gap-1.5"
          >
            Carrinho
            {count > 0 && (
              <span className="bg-accent text-background text-xs font-medium min-w-[1.25rem] h-5 px-1.5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <Link
              to="/account"
              className="text-sm font-medium text-secondary hover:text-accent transition-colors"
            >
              Conta
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-secondary hover:text-accent transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
