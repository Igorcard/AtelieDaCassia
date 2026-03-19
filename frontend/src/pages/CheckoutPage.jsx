import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext.jsx'
import { createOrder } from '../services/ordersService.js'
import { quoteShipping } from '../services/shippingService.js'
import { getErrorMessage } from '../services/api.js'
import { formatCurrency } from '../utils/format.js'

const emptyAddress = () => ({
  postalCode: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
})

export default function CheckoutPage() {
  const { items, total, count, clearCart } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [address, setAddress] = useState(emptyAddress)
  const [shippingQuote, setShippingQuote] = useState(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState('')
  const navigate = useNavigate()

  const cartKey = useMemo(
    () =>
      JSON.stringify(
        items.map(({ productId, quantity }) => ({ productId, quantity })),
      ),
    [items],
  )

  useEffect(() => {
    const digits = String(address.postalCode).replace(/\D/g, '')
    if (digits.length !== 8 || count === 0) {
      setShippingQuote(null)
      setQuoteError('')
      return undefined
    }

    let cancelled = false
    const t = setTimeout(async () => {
      setQuoteLoading(true)
      setQuoteError('')
      try {
        const data = await quoteShipping({
          items,
          postalCode: address.postalCode,
        })
        if (!cancelled) {
          setShippingQuote(data)
        }
      } catch (err) {
        if (!cancelled) {
          setShippingQuote(null)
          setQuoteError(getErrorMessage(err))
        }
      } finally {
        if (!cancelled) setQuoteLoading(false)
      }
    }, 450)

    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [address.postalCode, cartKey, count, items])

  function setField(key, value) {
    setAddress((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (count === 0 || !shippingQuote) return
    setError('')
    setSubmitting(true)
    try {
      const orderItems = items.map(({ productId, quantity }) => ({
        productId,
        quantity,
      }))
      await createOrder({
        status: 'PENDING',
        items: orderItems,
        shippingAddress: {
          postalCode: address.postalCode,
          street: address.street.trim(),
          number: address.number.trim(),
          complement: address.complement.trim() || undefined,
          district: address.district.trim() || undefined,
          city: address.city.trim(),
          state: address.state.trim(),
        },
      })
      setSuccess(true)
      clearCart()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const cepDigits = String(address.postalCode).replace(/\D/g, '')
  const canSubmit =
    shippingQuote &&
    !quoteLoading &&
    cepDigits.length === 8 &&
    !quoteError

  if (count === 0 && !success) {
    navigate('/cart', { replace: true })
    return null
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <h1 className="font-serif text-3xl text-secondary mb-4">
          Pedido realizado
        </h1>
        <p className="text-secondary/80 mb-8">
          Obrigado! Seu pedido foi enviado.
        </p>
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
      <h1 className="font-serif text-3xl text-secondary mb-6">
        Finalizar pedido
      </h1>
      <div className="text-secondary/80 mb-6 space-y-1 text-sm">
        <p>{count} item(ns)</p>
        <p>Subtotal: {formatCurrency(total)}</p>
        <p>
          Frete (Melhor Envio — menor cotação):{' '}
          {quoteLoading && <span className="text-secondary/60">calculando…</span>}
          {!quoteLoading && shippingQuote && (
            <span>
              {formatCurrency(shippingQuote.shippingAmount)}
              {shippingQuote.cheapest?.name && (
                <span className="text-secondary/60">
                  {' '}
                  ({shippingQuote.cheapest.name}
                  {shippingQuote.cheapest.company
                    ? ` · ${shippingQuote.cheapest.company}`
                    : ''}
                  )
                </span>
              )}
            </span>
          )}
          {!quoteLoading &&
            !shippingQuote &&
            cepDigits.length === 8 &&
            quoteError && (
              <span className="text-accent block mt-1">{quoteError}</span>
            )}
          {!quoteLoading && cepDigits.length !== 8 && (
            <span className="text-secondary/60"> informe o CEP</span>
          )}
        </p>
        <p className="font-medium text-secondary pt-1">
          Total:{' '}
          {shippingQuote
            ? formatCurrency(shippingQuote.total)
            : '—'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="border border-secondary/20 p-4 space-y-3">
          <legend className="text-sm font-medium text-secondary px-1">
            Endereço de entrega
          </legend>
          <div>
            <label
              htmlFor="checkout-cep"
              className="block text-xs text-secondary/70 mb-1"
            >
              CEP
            </label>
            <input
              id="checkout-cep"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              value={address.postalCode}
              onChange={(e) => setField('postalCode', e.target.value)}
              className="w-full border border-secondary/25 px-3 py-2 text-sm bg-background text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="00000-000"
              required
            />
          </div>
          <div>
            <label
              htmlFor="checkout-street"
              className="block text-xs text-secondary/70 mb-1"
            >
              Rua
            </label>
            <input
              id="checkout-street"
              type="text"
              autoComplete="street-address"
              value={address.street}
              onChange={(e) => setField('street', e.target.value)}
              className="w-full border border-secondary/25 px-3 py-2 text-sm bg-background text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="checkout-num"
                className="block text-xs text-secondary/70 mb-1"
              >
                Número
              </label>
              <input
                id="checkout-num"
                type="text"
                value={address.number}
                onChange={(e) => setField('number', e.target.value)}
                className="w-full border border-secondary/25 px-3 py-2 text-sm bg-background text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label
                htmlFor="checkout-comp"
                className="block text-xs text-secondary/70 mb-1"
              >
                Complemento
              </label>
              <input
                id="checkout-comp"
                type="text"
                value={address.complement}
                onChange={(e) => setField('complement', e.target.value)}
                className="w-full border border-secondary/25 px-3 py-2 text-sm bg-background text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="checkout-district"
              className="block text-xs text-secondary/70 mb-1"
            >
              Bairro
            </label>
            <input
              id="checkout-district"
              type="text"
              value={address.district}
              onChange={(e) => setField('district', e.target.value)}
              className="w-full border border-secondary/25 px-3 py-2 text-sm bg-background text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="checkout-city"
                className="block text-xs text-secondary/70 mb-1"
              >
                Cidade
              </label>
              <input
                id="checkout-city"
                type="text"
                autoComplete="address-level2"
                value={address.city}
                onChange={(e) => setField('city', e.target.value)}
                className="w-full border border-secondary/25 px-3 py-2 text-sm bg-background text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            <div>
              <label
                htmlFor="checkout-uf"
                className="block text-xs text-secondary/70 mb-1"
              >
                UF
              </label>
              <input
                id="checkout-uf"
                type="text"
                maxLength={2}
                autoComplete="address-level1"
                value={address.state}
                onChange={(e) =>
                  setField('state', e.target.value.toUpperCase())
                }
                className="w-full border border-secondary/25 px-3 py-2 text-sm uppercase bg-background text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="SP"
                required
              />
            </div>
          </div>
        </fieldset>

        {error && <p className="text-accent text-sm">{error}</p>}
        {!canSubmit && cepDigits.length === 8 && !quoteLoading && (
          <p className="text-secondary/70 text-sm">
            Ajuste o CEP ou o carrinho para obter cotação de frete antes de
            confirmar.
          </p>
        )}
        <button
          type="submit"
          disabled={submitting || !canSubmit}
          className="w-full py-3.5 px-4 bg-accent text-background font-medium text-sm tracking-wide hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors"
        >
          {submitting ? 'Enviando…' : 'Confirmar pedido'}
        </button>
      </form>
      <p className="mt-8">
        <Link
          to="/cart"
          className="text-primary hover:text-accent font-medium text-sm transition-colors"
        >
          Voltar ao carrinho
        </Link>
      </p>
    </div>
  )
}
