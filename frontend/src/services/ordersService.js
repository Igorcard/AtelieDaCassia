import api from './api.js'

function toApiShippingAddress(addr) {
  if (!addr) return undefined
  return {
    postalCode: addr.postalCode ?? addr.cep,
    street: addr.street,
    number: addr.number,
    complement: addr.complement || undefined,
    district: addr.district || undefined,
    city: addr.city,
    state: addr.state ?? addr.uf,
  }
}

export async function createOrder(payload) {
  const { data } = await api.post('/orders', {
    status: payload.status || 'PENDING',
    items: payload.items.map(({ productId, quantity }) => ({
      productId,
      quantity,
    })),
    shippingAddress: toApiShippingAddress(payload.shippingAddress),
  })
  return data
}
