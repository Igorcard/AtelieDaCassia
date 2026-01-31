export class Inventory {
  constructor({ quantity, productId }) {
    this.quantity = Number(quantity)
    this.productId = Number(productId)
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
}
