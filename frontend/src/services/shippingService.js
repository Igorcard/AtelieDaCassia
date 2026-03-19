import api from './api.js'

export async function quoteShipping({ items, postalCode }) {
  const { data } = await api.post('/shipping/quote', {
    items: items.map(({ productId, quantity }) => ({ productId, quantity })),
    postalCode,
  })
  return data
}
