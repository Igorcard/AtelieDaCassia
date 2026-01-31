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
  }
}
