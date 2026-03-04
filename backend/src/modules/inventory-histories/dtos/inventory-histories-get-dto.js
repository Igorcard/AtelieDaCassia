import { validateSchema } from '../../../shared/utils/helpers/validator-helper.js'

export class InventoryHistoryResponseDTO {
  constructor(inventoryHistory) {
    this.id = inventoryHistory.id
    this.quantity = inventoryHistory.quantity
    this.productId = inventoryHistory.productId
    this.type = inventoryHistory.type
    this.referenceId = inventoryHistory.referenceId
    this.createdAt = inventoryHistory.createdAt
  }
}

export class InventoryHistoriesResponseDTO {
  constructor(inventoryHistories) {
    this.inventoryHistories = inventoryHistories.map(inventoryHistory => new InventoryHistoryResponseDTO(inventoryHistory))
  }
}

export class GetInventoryHistoriesDTO {
  constructor(body) {
    validateSchema(body, schemas.getInventoryHistories)
    if (body.page !== undefined) {
      this.page = Number(body.page)
    }
    if (body.limit !== undefined) {
      this.limit = Number(body.limit)
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
  getInventoryHistories: {
    page: {
      type: 'number',
      required: false,
    },
    limit: {
      type: 'number',
      required: false,
    },
    productId: {
      type: 'number',
      required: false,
    },
    type: {
      type: 'string',
      required: false,
    },
    referenceId: {
      type: 'number',
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
  },
}
