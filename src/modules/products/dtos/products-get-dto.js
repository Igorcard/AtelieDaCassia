import { InventoryResponseDTO } from '../../inventory/dtos/inventory-get-dto.js'
import { validateSchema } from '../../../shared/utils/helpers/validator-helper.js'

export class GetProductsDTO {
  constructor(body) {
    validateSchema(body, schemas.getProducts)
    if (body.page !== undefined) {
      this.page = Number(body.page)
    }
    if (body.limit !== undefined) {
      this.limit = Number(body.limit)
    }
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
    }
    if (body.createdAt !== undefined) {
      this.createdAt = new Date(body.createdAt)
    }
    if (body.updatedAt !== undefined) {
      this.updatedAt = new Date(body.updatedAt)
    }
    if (body.orderBy !== undefined) {
      this.orderBy = String(body.orderBy).trim()
    }
    if (body.orderDirection !== undefined) {
      this.orderDirection = String(body.orderDirection).trim()
    }
  }
}

const schemas = {
  getProducts: {
    page: {
      type: 'number',
      required: false,
    },
    limit: {
      type: 'number',
      required: false,
    },
    description: {
      type: 'string',
      required: false,
    },
    sku: {
      type: 'string',
      required: false,
    },
    salePrice: {
      type: 'number',
      required: false,
    },
    costPrice: {
      type: 'number',
      required: false,
    },
    active: {
      type: 'boolean',
      required: false,
    },
    createdAt: {
      type: 'date',
      required: false,
    },
    updatedAt: {
      type: 'date',
      required: false,
    },
    orderBy: {
      type: 'string',
      required: false,
    },
    orderDirection: {
      type: 'string',
      required: false,
    },
  }
}

export class ProductsResponseDTO {
  constructor(products) {
    this.products = products.map(product => new ProductResponseDTO(product))
  }
}

export class ProductResponseDTO {
  constructor(product) {
    this.id = product.id
    this.description = product.description
    this.sku = product.sku
    this.salePrice = product.salePrice
    this.costPrice = product.costPrice
    this.active = product.active
    this.createdAt = product.createdAt
    this.updatedAt = product.updatedAt
    this.inventory = new InventoryResponseDTO(product.inventory)
  }
}
