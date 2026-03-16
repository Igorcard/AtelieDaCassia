import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-neutral-light/50 border-t border-neutral-light mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-serif text-lg text-secondary">
            Ateliê da Cássia
          </p>
          <nav className="flex items-center gap-8">
            <Link
              to="/products"
              className="text-sm text-secondary hover:text-accent transition-colors"
            >
              Coleção
            </Link>
            <Link
              to="/cart"
              className="text-sm text-secondary hover:text-accent transition-colors"
            >
              Carrinho
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-center sm:text-left text-sm text-neutral">
          © {new Date().getFullYear()} Ateliê da Cássia. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
