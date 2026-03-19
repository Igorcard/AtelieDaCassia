import * as productsRepository from '../../products/repositories/products-repository.js'
import * as melhorEnvioShipping from '../../../shared/services/melhor-envio-shipping-service.js'
import {
  BadRequestException,
  NotFoundException,
} from '../../../shared/types/result-classes.js'

function moneyFromDb(value) {
  const n = Number(value)
  if (Number.isNaN(n)) {
    throw new BadRequestException({ message: 'Invalid product price' })
  }
  return Math.round(n * 100) / 100
}

export async function quoteShipping(dto) {
  const lines = []
  for (const row of dto.items) {
    const product = await productsRepository.findBy({ id: row.productId })
    if (!product) {
      throw new NotFoundException({ message: 'Product not found' })
    }
    if (product.active === false) {
      throw new BadRequestException({ message: 'Product is not active' })
    }
    const unitPriceBrl = moneyFromDb(product.salePrice)
    lines.push({
      product,
      quantity: row.quantity,
      unitPriceBrl,
    })
  }

  const itemsSubtotal =
    Math.round(
      lines.reduce((acc, l) => acc + l.quantity * l.unitPriceBrl, 0) * 100,
    ) / 100

  const { shippingBrl, cheapest, quotes } =
    await melhorEnvioShipping.calculateShippingFromLines(lines, dto.postalCode)

  const total = Math.round((itemsSubtotal + shippingBrl) * 100) / 100

  return {
    itemsSubtotal,
    shippingAmount: shippingBrl,
    total,
    cheapest: {
      id: cheapest.id,
      name: cheapest.name,
      custom_price: cheapest.custom_price,
      delivery_time: cheapest.custom_delivery_time,
      company: cheapest.company?.name,
    },
    quotes: quotes.map((q) => ({
      id: q.id,
      name: q.name,
      custom_price: q.custom_price,
      delivery_time: q.custom_delivery_time,
      company: q.company?.name,
    })),
  }
}
