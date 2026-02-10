import dotenv from 'dotenv'
import { NotFoundException } from '../../../shared/types/result-classes.js'
import * as inventoryHistoriesRepository from '../repositories/inventory-histories-repository.js'

dotenv.config()

export async function getInventoryHistories(dto) {
  console.log(dto)
  const page = Number.isFinite(dto.page) ? Math.max(1, dto.page) : 1
  const limit = Number.isFinite(dto.limit) ? Math.max(1, dto.limit) : 20
  const skip = (page - 1) * limit

  const where = {}
  if (Number.isFinite(dto.productId)) {
    where.productId = dto.productId
  }
  if (Number.isFinite(dto.referenceId)) {
    where.referenceId = dto.referenceId
  }
  if (dto.type) {
    where.type = dto.type
  }
  if (dto.createdAt instanceof Date && !Number.isNaN(dto.createdAt.valueOf())) {
    const start = new Date(dto.createdAt)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(end.getDate() + 1)
    where.createdAt = { gte: start, lt: end }
  }

  const allowedOrderBy = new Set(['id', 'createdAt', 'quantity', 'productId', 'type', 'referenceId'])
  const orderByField = allowedOrderBy.has(dto.orderBy) ? dto.orderBy : 'createdAt'
  const orderDirection = dto.orderDirection === 'asc' ? 'asc' : 'desc'

  const inventoryHistories = await inventoryHistoriesRepository.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [orderByField]: orderDirection },
  })

  return inventoryHistories
}

export async function getInventoryHistory(productId) {
  const inventoryHistory = await inventoryHistoriesRepository.findBy({ productId })
  if (!inventoryHistory) {
    throw new NotFoundException({ message: 'Inventory history not found' })
  }
  return inventoryHistory
}
