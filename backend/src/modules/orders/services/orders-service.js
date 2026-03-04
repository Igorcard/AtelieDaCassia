import dotenv from 'dotenv'
import * as productsRepository from '../../products/repositories/products-repository.js'
import * as inventoryRepository from '../../inventory/repositories/inventory-repository.js'
import { BadRequestException, NotFoundException } from '../../../shared/types/result-classes.js'
import { Order } from '../entities/order-entity.js'
import { OrderItem } from '../../order-items/entities/order-items-entity.js'
import { InventoryHistoriesType } from '../../inventory-histories/entities/inventory-histories-type-entity.js'
import { withTransaction } from '../../../shared/utils/helpers/transaction-helper.js'

dotenv.config()

export async function createOrder(dto) {
  const orderEntity = new Order(dto)
  const orderItems = dto.items.map(item => new OrderItem(item))

  for (const item of orderItems) {
    const product = await productsRepository.findBy({ id: item.productId })
    if (!product) {
      throw new NotFoundException({ message: 'Product not found' })
    }

    const inventory = await inventoryRepository.findBy({ productId: item.productId })
    if (!inventory) {
      throw new NotFoundException({ message: 'Inventory not found' })
    }

    if (inventory.quantity < item.quantity) {
      throw new BadRequestException({ message: 'Inventory quantity is less than the quantity to exit' })
    }

    if (product.active === false) {
      throw new BadRequestException({ message: 'Product is not active' })
    }
  }

  const total = orderItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)

  if (total !== orderEntity.total) {
    throw new BadRequestException({ message: 'Total is not equal to the sum of the items' })
  }

  return withTransaction(async (tx) => {

    const order = await tx.orders.create({
      data: {
        userId: orderEntity.userId,
        status: orderEntity.status,
        total: orderEntity.total,
        createdAt: orderEntity.createdAt,
        updatedAt: orderEntity.updatedAt,
      }
    })

    const items = []
    for (const item of orderItems) {
      const orderItem = await tx.orderItems.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }
      })

      items.push(orderItem)

      const inventory = await tx.inventory.findUnique({ where: { productId: item.productId } })

      await tx.inventory.update({
        where: { productId: item.productId },
        data: {
          quantity: inventory.quantity - item.quantity,
        }
      })

      await tx.inventoryHistories.create({
        data: {
          quantity: item.quantity,
          productId: item.productId,
          type: InventoryHistoriesType.STOCK_OUT,
          referenceId: order.id
        }
      })
    }

    order.items = items
    return order
  })
}
