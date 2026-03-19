export class OrderItem {
  constructor({ productId, quantity, unitPrice }) {
    this.productId = Number(productId)
    this.quantity = Number(quantity)
    this.unitPrice = unitPrice != null ? Number(unitPrice) : undefined
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
}
