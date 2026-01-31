import dotenv from 'dotenv'
import { ConflictException, NotFoundException } from '../../../shared/types/result-classes.js'
import { Inventory } from '../entities/inventory-entity.js'
import { CreateInventoryHistoryDTO } from '../../inventoryHistories/dtos/inventory-histories-create-dto.js'
import * as productsRepository from '../../products/repositories/products-repository.js'
import * as inventoryRepository from '../repositories/inventory-repository.js'
import * as inventoryHistoriesServices from '../../inventoryHistories/services/inventory-histories-services.js'

dotenv.config()

export async function createInventory(dto) {
  const existingInventory = await inventoryRepository.findBy({ productId: dto.productId })
  if (existingInventory) {
    throw new ConflictException({ message: 'Inventory already exists' })
  }

  const product = await productsRepository.findBy({ id: dto.productId })
  if (!product) {
    throw new NotFoundException({ message: 'Product not found' })
  }

  const inventoryEntity = new Inventory(dto)

  const inventory = await inventoryRepository.create(inventoryEntity)

  const inventoryHistoryDto = new CreateInventoryHistoryDTO({
    quantity: inventory.quantity,
    productId: inventory.productId,
    type: 'create',
    referenceId: inventory.id,
  })

  await inventoryHistoriesServices.createInventoryHistory(inventoryHistoryDto)

  return inventory
}
