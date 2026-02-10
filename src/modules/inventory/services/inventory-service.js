import dotenv from 'dotenv'
import { BadRequestException, NotFoundException } from '../../../shared/types/result-classes.js'
import { Inventory } from '../entities/inventory-entity.js'
import { CreateInventoryHistoryDTO } from '../../inventory-histories/dtos/inventory-histories-create-dto.js'
import { InventoryHistoriesType } from '../../inventory-histories/entities/inventory-histories-type-entity.js'
import { withTransaction } from '../../../shared/utils/helpers/transaction-helper.js'
import * as productsRepository from '../../products/repositories/products-repository.js'
import * as inventoryRepository from '../repositories/inventory-repository.js'

dotenv.config()

export async function updateInventory(productId, dto) {
  const existingInventory = await inventoryRepository.findBy({ productId })
  if (!existingInventory) {
    throw new NotFoundException({ message: 'Inventory not found' })
  }

  const product = await productsRepository.findBy({ id: productId })
  if (!product) {
    throw new NotFoundException({ message: 'Product not found' })
  }

  const inventoryEntity = new Inventory({
    quantity: dto.quantity,
    productId: productId,
  })

  return withTransaction(async (tx) => {
    const inventory = await tx.inventory.update({
      where: { productId },
      data: inventoryEntity,
    })

    const inventoryHistoryDto = new CreateInventoryHistoryDTO({
      quantity: inventory.quantity,
      productId: inventory.productId,
      type: InventoryHistoriesType.ADJUSTMENT,
      referenceId: inventory.id,
    })

    await tx.inventoryHistories.create({
      data: inventoryHistoryDto,
    })

    return inventory
  })
}

export async function getInventory(productId) {
  const inventory = await inventoryRepository.findBy({ productId })
  if (!inventory) {
    throw new NotFoundException({ message: 'Inventory not found' })
  }
  return inventory
}

export async function getInventories() {
  const inventories = await inventoryRepository.findMany()
  if (!inventories || inventories.length === 0) {
    throw new NotFoundException({ message: 'Inventories not found' })
  }

  return inventories
}

export async function createInventoryEntry(productId, dto) {
  const existingInventory = await inventoryRepository.findBy({ productId })
  if (!existingInventory) {
    throw new NotFoundException({ message: 'Inventory not found' })
  }

  const product = await productsRepository.findBy({ id: productId })
  if (!product) {
    throw new NotFoundException({ message: 'Product not found' })
  }

  const inventoryEntity = new Inventory({
    quantity: existingInventory.quantity + dto.quantity,
    productId: productId,
  })

  return withTransaction(async (tx) => {
    const inventory = await tx.inventory.update({
      where: { productId },
      data: inventoryEntity,
    })

    const inventoryHistoryDto = new CreateInventoryHistoryDTO({
      quantity: inventory.quantity,
      productId: inventory.productId,
      type: InventoryHistoriesType.STOCK_IN,
      referenceId: inventory.id,
    })

    await tx.inventoryHistories.create({
      data: inventoryHistoryDto,
    })

    return inventory
  })
}

export async function createInventoryExit(productId, dto) {
  const existingInventory = await inventoryRepository.findBy({ productId })
  if (!existingInventory) {
    throw new NotFoundException({ message: 'Inventory not found' })
  }

  const product = await productsRepository.findBy({ id: productId })
  if (!product) {
    throw new NotFoundException({ message: 'Product not found' })
  }

  if (existingInventory.quantity < dto.quantity) {
    throw new BadRequestException({ message: 'Inventory quantity is less than the quantity to exit' })
  }

  const inventoryEntity = new Inventory({
    quantity: existingInventory.quantity - dto.quantity,
    productId: productId,
  })

  return withTransaction(async (tx) => {
    const inventory = await tx.inventory.update({
      where: { productId },
      data: inventoryEntity,
    })

    const inventoryHistoryDto = new CreateInventoryHistoryDTO({
      quantity: inventory.quantity,
      productId: inventory.productId,
      type: InventoryHistoriesType.STOCK_OUT,
      referenceId: inventory.id,
    })

    await tx.inventoryHistories.create({
      data: inventoryHistoryDto,
    })

    return inventory
  })
}
