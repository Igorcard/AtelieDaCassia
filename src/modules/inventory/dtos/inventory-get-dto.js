export class InventoryResponseDTO {
  constructor(inventory) {
    this.id = inventory.id
    this.quantity = inventory.quantity
    this.productId = inventory.productId
    this.createdAt = inventory.createdAt
    this.updatedAt = inventory.updatedAt
  }
}
