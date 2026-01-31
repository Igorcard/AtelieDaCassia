import { validateSchema } from '../../../shared/utils/helpers/validator-helper.js'

export class UpdateProductDTO {
  constructor(body) {
    validateSchema(body, schemas.updateProduct)

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
  }
}

const schemas = {
  updateProduct: {
    description: {
      type: 'string',
      required: false,
      minLength: 1,
    },
    sku: {
      type: 'string',
      required: false,
      minLength: 1,
    },
    salePrice: {
      type: 'number',
      required: false,
      min: 0,
    },
    costPrice: {
      type: 'number',
      required: false,
      min: 0,
    },
    active: {
      type: 'boolean',
      required: false,
    },
  },
}

