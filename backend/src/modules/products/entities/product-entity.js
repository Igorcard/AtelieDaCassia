export class Product {
  constructor({ description, sku, salePrice, costPrice, active }) {
    this.description = description
    this.sku = sku
    this.salePrice = salePrice
    this.costPrice = costPrice
    this.active = active
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
}
