import { BadRequestException } from '../../../shared/types/result-classes.js'
import * as orderItemsDtos from '../../order-items/dtos/order-items-create-dto.js'

export class ShippingQuoteDTO {
  constructor(body) {
    const postalCode = body?.postalCode ?? body?.cep
    if (postalCode === undefined || postalCode === null || String(postalCode).trim() === '') {
      throw new BadRequestException({ message: 'postalCode is required' })
    }
    if (!Array.isArray(body?.items) || body.items.length === 0) {
      throw new BadRequestException({ message: 'items must be a non-empty array' })
    }
    this.postalCode = String(postalCode).trim()
    this.items = body.items.map((item) => new orderItemsDtos.OrderItemDTO(item))
  }
}
