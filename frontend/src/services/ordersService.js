import api from './api.js'

/**
 * Create order. Requires auth. userId is set by backend from token.
 * @param {{ status: string, total: number, items: Array<{ productId: number, quantity: number, unitPrice: number }> }} payload
 */
export async function createOrder(payload) {
  const { data } = await api.post('/orders', {
    status: payload.status || 'PENDING',
    total: payload.total,
    items: payload.items,
  })
  return data
}
