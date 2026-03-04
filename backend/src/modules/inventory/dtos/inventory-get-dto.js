export class InventoryResponseDTO {
  constructor(inventory) {
    this.id = inventory.id
    this.quantity = inventory.quantity
    this.productId = inventory.productId
  }
}

export class InventoriesResponseDTO {
  constructor(inventories) {
    this.inventories = inventories.map(inventory => new InventoryResponseDTO(inventory))
  }
}
