import dotenv from 'dotenv'
import * as productsRepository from '../../products/repositories/products-repository.js'
import * as inventoryRepository from '../../inventory/repositories/inventory-repository.js'
import {
  BadRequestException,
  NotFoundException,
} from '../../../shared/types/result-classes.js'
import { Order } from '../entities/order-entity.js'
import { OrderItem } from '../../order-items/entities/order-items-entity.js'
import { InventoryHistoriesType } from '../../inventory-histories/entities/inventory-histories-type-entity.js'
import { withTransaction } from '../../../shared/utils/helpers/transaction-helper.js'
import * as melhorEnvioShipping from '../../../shared/services/melhor-envio-shipping-service.js'

dotenv.config()

function moneyFromDb(value) {
  const n = Number(value)
  if (Number.isNaN(n)) {
    throw new BadRequestException({ message: 'Invalid product price' })
  }
  return Math.round(n * 100) / 100
}

export async function createOrder(dto) {
  if (!dto.items?.length) {
    throw new BadRequestException({
      message: 'Order must have at least one item',
    })
  }

  const linesForShipping = []
  const orderItems = []

  for (const row of dto.items) {
    const product = await productsRepository.findBy({ id: row.productId })
    if (!product) {
      throw new NotFoundException({ message: 'Product not found' })
    }

    const inventory = await inventoryRepository.findBy({
      productId: row.productId,
    })
    if (!inventory) {
      throw new NotFoundException({ message: 'Inventory not found' })
    }

    if (inventory.quantity < row.quantity) {
      throw new BadRequestException({
        message: 'Inventory quantity is less than the quantity to exit',
      })
    }

    if (product.active === false) {
      throw new BadRequestException({ message: 'Product is not active' })
    }

    const unitPrice = moneyFromDb(product.salePrice)
    orderItems.push(
      new OrderItem({
        productId: row.productId,
        quantity: row.quantity,
        unitPrice,
      }),
    )
    linesForShipping.push({
      product,
      quantity: row.quantity,
      unitPriceBrl: unitPrice,
    })
  }

  const itemsSubtotal =
    Math.round(
      orderItems.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0,
      ) * 100,
    ) / 100

  const { shippingBrl: shippingAmount } =
    await melhorEnvioShipping.calculateShippingFromLines(
      linesForShipping,
      dto.deliveryPostalCode,
    )

  const total = Math.round((itemsSubtotal + shippingAmount) * 100) / 100

  const orderEntity = new Order({
    userId: dto.userId,
    status: dto.status,
    total,
    shippingAmount,
    deliveryPostalCode: dto.deliveryPostalCode,
    deliveryStreet: dto.deliveryStreet,
    deliveryNumber: dto.deliveryNumber,
    deliveryComplement: dto.deliveryComplement,
    deliveryDistrict: dto.deliveryDistrict,
    deliveryCity: dto.deliveryCity,
    deliveryState: dto.deliveryState,
  })

  return withTransaction(async (tx) => {
    const order = await tx.orders.create({
      data: {
        userId: orderEntity.userId,
        status: orderEntity.status,
        total: orderEntity.total,
        shippingAmount: orderEntity.shippingAmount,
        deliveryPostalCode: orderEntity.deliveryPostalCode,
        deliveryStreet: orderEntity.deliveryStreet,
        deliveryNumber: orderEntity.deliveryNumber,
        deliveryComplement: orderEntity.deliveryComplement,
        deliveryDistrict: orderEntity.deliveryDistrict,
        deliveryCity: orderEntity.deliveryCity,
        deliveryState: orderEntity.deliveryState,
        createdAt: orderEntity.createdAt,
        updatedAt: orderEntity.updatedAt,
      },
    })

    const items = []
    for (const item of orderItems) {
      const orderItem = await tx.orderItems.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        },
      })

      items.push(orderItem)

      const inventory = await tx.inventory.findUnique({
        where: { productId: item.productId },
      })

      await tx.inventory.update({
        where: { productId: item.productId },
        data: {
          quantity: inventory.quantity - item.quantity,
        },
      })

      await tx.inventoryHistories.create({
        data: {
          quantity: item.quantity,
          productId: item.productId,
          type: InventoryHistoriesType.STOCK_OUT,
          referenceId: order.id,
        },
      })
    }

    order.items = items
    order.itemsSubtotal = itemsSubtotal
    order.shippingAmount = shippingAmount
    return order
  })
}
