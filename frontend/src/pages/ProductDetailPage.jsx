import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct } from '../services/productsService.js'
import { getErrorMessage } from '../services/api.js'
import { useCart } from '../contexts/CartContext.jsx'
import { formatCurrency } from '../utils/format.js'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setError('')
    getProduct(id)
      .then((data) => { if (!cancelled) setProduct(data) })
      .catch((err) => { if (!cancelled) setError(getErrorMessage(err)) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  function handleAdd() {
    if (!product) return
    const price = Number(product.salePrice) || 0
    addItem(product, qty, price)
    setQty(1)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center text-neutral">
        Carregando…
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <p className="text-accent mb-4">{error || 'Produto não encontrado.'}</p>
        <Link to="/products" className="text-primary hover:text-accent font-medium text-sm transition-colors">Voltar à listagem</Link>
      </div>
    )
  }

  const stock = product.inventory?.quantity ?? 0

  return (
    <div className="max-w-5xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="aspect-[3/4] bg-neutral-light overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80)',
            }}
          />
        </div>
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-secondary mb-2">{product.description}</h1>
          <p className="text-neutral mb-4">SKU: {product.sku}</p>
          <p className="text-2xl text-primary font-medium mb-2">{formatCurrency(product.salePrice)}</p>
          <p className="text-sm text-secondary/80 mb-8">Estoque: {stock}</p>
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-secondary">Qtd:</span>
              <input
                type="number"
                min={1}
                max={stock}
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-20 px-3 py-2 border border-neutral bg-background text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </label>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.active || stock < 1 || qty > stock}
              className="px-6 py-3 bg-accent text-background font-medium text-sm tracking-wide hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Adicionar ao carrinho
            </button>
          </div>
          <Link to="/products" className="text-primary hover:text-accent font-medium text-sm transition-colors">Voltar à listagem</Link>
        </div>
      </div>
    </div>
  )
}
