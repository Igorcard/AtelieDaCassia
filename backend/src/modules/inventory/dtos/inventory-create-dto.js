import { validateSchema } from '../../../shared/utils/helpers/validator-helper.js'

export class CreateInventoryDTO {
  constructor(body) {
    validateSchema(body, schemas.createInventory)

    if (body.quantity !== undefined) {
      this.quantity = Number(body.quantity)
    }
    if (body.productId !== undefined) {
      this.productId = Number(body.productId)
    }
  }
}

const schemas = {
  createInventory: {
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
  },
}
