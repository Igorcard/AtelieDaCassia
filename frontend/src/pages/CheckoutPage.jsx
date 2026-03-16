import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext.jsx'
import { createOrder } from '../services/ordersService.js'
import { getErrorMessage } from '../services/api.js'
import { formatCurrency } from '../utils/format.js'

export default function CheckoutPage() {
  const { items, total, count, clearCart } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (count === 0) return
    setError('')
    setSubmitting(true)
    try {
      const orderItems = items.map(({ productId, quantity, unitPrice }) => ({
        productId,
        quantity,
        unitPrice: Number(unitPrice),
      }))
      await createOrder({
        status: 'PENDING',
        total: Number(total.toFixed(2)),
        items: orderItems,
      })
      setSuccess(true)
      clearCart()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (count === 0 && !success) {
    navigate('/cart', { replace: true })
    return null
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <h1 className="font-serif text-3xl text-secondary mb-4">Pedido realizado</h1>
        <p className="text-secondary/80 mb-8">Obrigado! Seu pedido foi enviado.</p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-accent text-background font-medium text-sm tracking-wide hover:bg-accent-hover transition-colors"
        >
          Voltar à coleção
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto py-12 sm:py-16 px-4">
      <h1 className="font-serif text-3xl text-secondary mb-6">Finalizar pedido</h1>
      <p className="text-secondary/80 mb-6">{count} item(ns) — Total: {formatCurrency(total)}</p>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-accent mb-4 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-4 bg-accent text-background font-medium text-sm tracking-wide hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors"
        >
          {submitting ? 'Enviando…' : 'Confirmar pedido'}
        </button>
      </form>
      <p className="mt-8">
        <Link to="/cart" className="text-primary hover:text-accent font-medium text-sm transition-colors">Voltar ao carrinho</Link>
      </p>
    </div>
  )
}
