export class InventoryHistory {
  constructor({ quantity, productId, type, referenceId }) {
    this.quantity = Number(quantity)
    this.productId = Number(productId)
    this.type = String(type).trim()
    this.referenceId = Number(referenceId)
    this.createdAt = new Date()
  }
}
