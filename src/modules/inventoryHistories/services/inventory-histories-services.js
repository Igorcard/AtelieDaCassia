import dotenv from 'dotenv'
import { NotFoundException } from '../../../shared/types/result-classes.js'
import { InventoryHistory } from '../entities/inventory-histories-entity.js'
import * as productsRepository from '../../products/repositories/products-repository.js'
import * as inventoryRepository from '../../inventory/repositories/inventory-repository.js'
import * as inventoryHistoriesRepository from '../repositories/inventory-histories-repository.js'

dotenv.config()

export async function createInventoryHistory(dto) {
  const inventory = await inventoryRepository.findBy({ productId: dto.productId })
  if (!inventory) {
    throw new NotFoundException({ message: 'Inventory not found' })
  }

  const product = await productsRepository.findBy({ id: dto.productId })
  if (!product) {
    throw new NotFoundException({ message: 'Product not found' })
  }

  const inventoryHistoryEntity = new InventoryHistory(dto)

  const inventoryHistory = await inventoryHistoriesRepository.create(inventoryHistoryEntity)

  return inventoryHistory
}
