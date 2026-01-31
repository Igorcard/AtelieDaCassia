import { validateSchema } from '../../../shared/utils/helpers/validator-helper.js'

export class CreateInventoryHistoryDTO {
  constructor(body) {
    validateSchema(body, schemas.createInventoryHistory)

    if (body.quantity !== undefined) {
      this.quantity = Number(body.quantity)
    }
    if (body.productId !== undefined) {
      this.productId = Number(body.productId)
    }
    if (body.type !== undefined) {
      this.type = String(body.type).trim()
    }
    if (body.referenceId !== undefined) {
      this.referenceId = Number(body.referenceId)
    }
  }
}

const schemas = {
  createInventoryHistory: {
    quantity: {
      type: 'number',
      required: true,
      min: 0,
    },
    productId: {
      type: 'number',
      required: true,
      min: 1,
    },
    type: {
      type: 'string',
      required: true,
      minLength: 1,
    },
    referenceId: {
      type: 'number',
      required: true,
      min: 1,
    },
  },
}
