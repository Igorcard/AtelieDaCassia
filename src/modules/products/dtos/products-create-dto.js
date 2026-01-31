import { validateSchema } from '../../../shared/utils/helpers/validator-helper.js'
import { InventoryResponseDTO } from '../../inventory/dtos/inventory-get-dto.js'

export class CreateProductResponseDTO {
  constructor({product,inventory}) {
    this.id = product.id
    this.description = product.description
    this.sku = product.sku
    this.salePrice = product.salePrice
    this.costPrice = product.costPrice
    this.active = product.active
    this.inventory = new InventoryResponseDTO(inventory)
    this.createdAt = product.createdAt
    this.updatedAt = product.updatedAt
  }
}

export class CreateProductDTO {
  constructor(body) {
    validateSchema(body, schemas.createProduct)

    if (body.description !== undefined) {
      this.description = String(body.description).trim()
    }

    if (body.sku !== undefined) {
      this.sku = String(body.sku).trim()
    }

    if (body.salePrice !== undefined) {
      this.salePrice = Number(body.salePrice)
    }

    if (body.costPrice !== undefined) {
      this.costPrice = Number(body.costPrice)
    }

    if (body.active !== undefined) {
      this.active = Boolean(body.active)
    } else {
      this.active = true
    }

    if (body.quantity !== undefined) {
      this.quantity = Number(body.quantity)
    } else {
      this.quantity = 0
    }
  }
}

const schemas = {
  createProduct: {
    description: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    sku: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    salePrice: {
      type: 'number',
      required: true,
      min: 0,
    },
    costPrice: {
      type: 'number',
      required: true,
      min: 0,
    },
    active: {
      type: 'boolean',
      required: false,
    },
    quantity: {
      type: 'number',
      required: false,
      min: 0,
    },
  },
}
