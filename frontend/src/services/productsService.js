import api from './api.js'

/**
 * List products. Requires auth.
 * @param {{ page?: number, limit?: number, description?: string, orderBy?: string, orderDirection?: string }} params
 */
export async function getProducts(params = {}) {
  const { data } = await api.post('/products', {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    description: params.description,
    orderBy: params.orderBy ?? 'createdAt',
    orderDirection: params.orderDirection ?? 'desc',
  })
  return data.products
}

/**
 * Get single product by id. Requires auth.
 * @param {number|string} id
 */
export async function getProduct(id) {
  const { data } = await api.get(`/product/${id}`)
  return data
}
