import { validateSchema } from '../../../shared/utils/helpers/validator-helper.js'

export class UpdateInventoryDTO {
  constructor(body) {
    validateSchema(body, schemas.updateInventory)

    if (body.quantity !== undefined) {
      this.quantity = Number(body.quantity)
    }
  }
}

export class UpdateInventoryResponseDTO {
  constructor(inventory) {
    this.inventory = inventory
  }
}

const schemas = {
  updateInventory: {
    quantity: {
      type: 'number',
      required: true,
      min: 0,
    }
  },
}
