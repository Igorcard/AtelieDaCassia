import { BadRequestException } from '../../../shared/types/result-classes.js'
import { validateSchema } from '../../../shared/utils/helpers/validator-helper.js'
import * as orderItemsDtos from '../../order-items/dtos/order-items-create-dto.js'
import { BR_STATES } from '../../../shared/utils/helpers/brazil-states-helper.js'

function normalizePostalCode(value) {
  const digits = String(value).replace(/\D/g, '')
  return digits.length === 8 ? digits : null
}

function validateShippingAddress(addr) {
  if (!addr || typeof addr !== 'object') {
    throw new BadRequestException({ message: 'shippingAddress is required' })
  }
  const postalCode = normalizePostalCode(addr.postalCode ?? addr.cep ?? '')
  if (!postalCode) {
    throw new BadRequestException({
      message: 'Invalid postal code (CEP): use 8 digits',
    })
  }
  const street = String(addr.street ?? '').trim()
  const number = String(addr.number ?? '').trim()
  const city = String(addr.city ?? '').trim()
  const state = String(addr.state ?? addr.uf ?? '')
    .trim()
    .toUpperCase()
    .slice(0, 2)
  if (street.length < 2) {
    throw new BadRequestException({ message: 'street is required' })
  }
  if (number.length < 1) {
    throw new BadRequestException({ message: 'number is required' })
  }
  if (city.length < 2) {
    throw new BadRequestException({ message: 'city is required' })
  }
  if (state.length !== 2 || !BR_STATES.has(state)) {
    throw new BadRequestException({ message: 'Invalid state (UF)' })
  }
  const complement =
    addr.complement != null && String(addr.complement).trim() !== ''
      ? String(addr.complement).trim()
      : null
  const district =
    addr.district != null && String(addr.district).trim() !== ''
      ? String(addr.district).trim()
      : null
  return {
    deliveryPostalCode: postalCode.replace(/(\d{5})(\d{3})/, '$1-$2'),
    deliveryStreet: street,
    deliveryNumber: number,
    deliveryComplement: complement,
    deliveryDistrict: district,
    deliveryCity: city,
    deliveryState: state,
  }
}

export class CreateOrderResponseDTO {
  constructor(order) {
    this.id = order.id
    this.status = order.status
    this.itemsSubtotal = Number(order.itemsSubtotal ?? 0)
    this.shippingAmount = Number(order.shippingAmount)
    this.total = Number(order.total)
    this.shippingAddress = {
      postalCode: order.deliveryPostalCode,
      street: order.deliveryStreet,
      number: order.deliveryNumber,
      complement: order.deliveryComplement,
      district: order.deliveryDistrict,
      city: order.deliveryCity,
      state: order.deliveryState,
    }
    this.items = order.items.map(
      (item) => new orderItemsDtos.OrderItemResponseDTO(item),
    )
    this.createdAt = order.createdAt
    this.updatedAt = order.updatedAt
  }
}

export class CreateOrderDTO {
  constructor(body) {
    const input = {
      status: 'PENDING',
      ...body,
    }
    validateSchema(input, schemas.createOrder)

    if (!Array.isArray(input.items) || input.items.length === 0) {
      throw new BadRequestException({
        message: 'items must be a non-empty array',
      })
    }

    const address = validateShippingAddress(input.shippingAddress)

    this.userId = String(input.userId).trim()
    this.status = String(input.status).trim()
    this.items = input.items.map(
      (item) => new orderItemsDtos.OrderItemDTO(item),
    )
    Object.assign(this, address)
  }
}

const schemas = {
  createOrder: {
    status: {
      type: 'string',
      required: true,
      custom: (v) =>
        ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(
          String(v).trim(),
        ),
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
