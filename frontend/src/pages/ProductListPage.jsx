import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../services/productsService.js'
import { getErrorMessage } from '../services/api.js'
import { useCart } from '../contexts/CartContext.jsx'
import { formatCurrency } from '../utils/format.js'

export default function ProductListPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getProducts({ page: 1, limit: 20 })
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!cancelled) {
          if (err.response?.status === 404) setProducts([])
          else setError(getErrorMessage(err))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  function handleAdd(product) {
    const price = Number(product.salePrice) || 0
    addItem(product, 1, price)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <p className="text-neutral">Carregando produtos…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <p className="text-accent mb-4">{error}</p>
        <Link to="/" className="text-primary hover:text-accent font-medium text-sm transition-colors">Início</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl sm:text-4xl text-secondary mb-10">Coleção</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {products.map((p) => (
          <article
            key={p.id}
            className="group bg-background overflow-hidden"
          >
            <Link to={`/product/${p.id}`} className="block">
              <div className="aspect-[3/4] bg-neutral-light overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80)',
                  }}
                />
              </div>
            </Link>
            <div className="p-5">
              <h2 className="font-serif text-lg text-secondary mb-1">{p.description}</h2>
              <p className="text-sm text-neutral mb-2">SKU: {p.sku}</p>
              <p className="text-primary font-medium mb-4">{formatCurrency(p.salePrice)}</p>
              <div className="flex gap-3">
                <Link
                  to={`/product/${p.id}`}
                  className="text-sm font-medium text-primary hover:text-accent transition-colors"
                >
                  Ver detalhes
                </Link>
                <button
                  type="button"
                  onClick={() => handleAdd(p)}
                  disabled={!p.active}
                  className="text-sm px-4 py-2 bg-accent text-background font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-neutral text-center py-12">Nenhum produto encontrado.</p>
      )}
      <p className="mt-10">
        <Link to="/" className="text-primary hover:text-accent font-medium text-sm transition-colors">Início</Link>
      </p>
    </div>
  )
}
