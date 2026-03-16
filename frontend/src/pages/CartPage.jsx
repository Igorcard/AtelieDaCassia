import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext.jsx'
import { formatCurrency } from '../utils/format.js'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, count, clearCart } = useCart()

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 sm:py-16 px-4">
        <h1 className="font-serif text-3xl text-secondary mb-4">Carrinho</h1>
        <p className="text-secondary/80 mb-6">Seu carrinho está vazio.</p>
        <Link to="/products" className="text-primary hover:text-accent font-medium text-sm transition-colors">Ver coleção</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-12 sm:py-16 px-4">
      <h1 className="font-serif text-3xl text-secondary mb-8">Carrinho</h1>
      <ul className="space-y-4 mb-10">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-light py-5"
          >
            <div>
              <p className="font-medium text-secondary">{item.description || `Produto #${item.productId}`}</p>
              <p className="text-sm text-neutral">
                {formatCurrency(item.unitPrice)} × {item.quantity}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.productId, Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-16 px-2 py-2 border border-neutral bg-background text-secondary text-center focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                className="text-sm text-secondary/80 hover:text-accent transition-colors"
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xl font-medium text-secondary mb-8">Total: {formatCurrency(total)}</p>
      <div className="flex flex-wrap gap-4">
        <Link
          to="/checkout"
          className="px-6 py-3 bg-accent text-background font-medium text-sm tracking-wide hover:bg-accent-hover transition-colors"
        >
          Finalizar pedido
        </Link>
        <button
          type="button"
          onClick={clearCart}
          className="px-6 py-3 border border-neutral text-secondary font-medium text-sm hover:bg-neutral-light/50 transition-colors"
        >
          Limpar carrinho
        </button>
      </div>
      <p className="mt-8">
        <Link to="/products" className="text-primary hover:text-accent font-medium text-sm transition-colors">Continuar comprando</Link>
      </p>
    </div>
  )
}
