import { validateSchema } from '../../../shared/utils/helpers/validator-helper.js'
import * as orderItemsDtos from '../../order-items/dtos/order-items-create-dto.js'

export class CreateOrderResponseDTO {
  constructor(order) {
    this.id = order.id
    this.status = order.status
    this.total = order.total
    this.items = order.items.map(item => new orderItemsDtos.OrderItemResponseDTO(item))
    this.createdAt = order.createdAt
    this.updatedAt = order.updatedAt
  }
}

export class CreateOrderDTO {
  constructor(body) {
    validateSchema(body, schemas.createOrder)

    this.userId = String(body.userId).trim()

    if (body.status !== undefined) {
      this.status = String(body.status).trim()
    }

    if (body.total !== undefined) {
      this.total = Number(body.total)
    }

    if (body.items !== undefined) {
      this.items = body.items.map(item => new orderItemsDtos.OrderItemDTO(item))
    }
  }
}

const schemas = {
  createOrder: {
    status: {
      type: 'string',
      required: true,
      enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    },
    total: {
      type: 'number',
      required: true,
      min: 0,
    },
    items: {
      type: 'array',
      required: true,
      items: {
        type: 'object',
        properties: orderItemsDtos.schemas.orderItem,
      },
    },
  },
}
