import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const CART_KEY = 'atelie_cart'

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = useCallback((product, quantity = 1, unitPrice) => {
    const price = unitPrice ?? product?.salePrice ?? 0
    setItems((prev) => {
      const i = prev.findIndex((x) => x.productId === product.id)
      if (i >= 0) {
        const next = [...prev]
        next[i].quantity += quantity
        next[i].unitPrice = price
        return next
      }
      return [...prev, { productId: product.id, quantity, unitPrice: price, description: product.description }]
    })
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((x) => x.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((x) => (x.productId === productId ? { ...x, quantity } : x))
    )
  }, [removeItem])

  const clearCart = useCallback(() => setItems([]), [])

  const total = items.reduce((acc, x) => acc + x.quantity * x.unitPrice, 0)
  const count = items.reduce((acc, x) => acc + x.quantity, 0)

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    count,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
