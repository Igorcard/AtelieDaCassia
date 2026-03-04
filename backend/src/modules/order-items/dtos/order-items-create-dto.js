import { validateSchema } from '../../../shared/utils/helpers/validator-helper.js'

export class OrderItemResponseDTO {
  constructor(item) {
    this.id = item.id
    this.productId = item.productId
    this.quantity = item.quantity
    this.unitPrice = item.unitPrice
    this.createdAt = item.createdAt
    this.updatedAt = item.updatedAt
  }
}

export class OrderItemDTO {
  constructor(item) {
    validateSchema(item, schemas.orderItem)
    if (item.productId !== undefined) {
      this.productId = Number(item.productId)
    }
    if (item.quantity !== undefined) {
      this.quantity = Number(item.quantity)
    }
    if (item.unitPrice !== undefined) {
      this.unitPrice = Number(item.unitPrice)
    }
  }
}

export const schemas = {
  orderItem: {
    productId: {
      type: 'number',
      required: true,
      min: 1,
    },
    quantity: {
      type: 'number',
      required: true,
      min: 1,
    },
    unitPrice: {
      type: 'number',
      required: true,
      min: 0,
    },
  },
}
