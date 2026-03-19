import { OrderStatus } from '../../../shared/types/orders-status.js'

export class Order {
  constructor({
    userId,
    status,
    total,
    shippingAmount,
    deliveryPostalCode,
    deliveryStreet,
    deliveryNumber,
    deliveryComplement,
    deliveryDistrict,
    deliveryCity,
    deliveryState,
  }) {
    this.userId = String(userId).trim()
    this.status = OrderStatus[String(status).trim()]
    this.total = Number(total)
    this.shippingAmount = Number(shippingAmount)
    this.deliveryPostalCode = String(deliveryPostalCode).trim()
    this.deliveryStreet = String(deliveryStreet).trim()
    this.deliveryNumber = String(deliveryNumber).trim()
    this.deliveryComplement =
      deliveryComplement != null && String(deliveryComplement).trim() !== ''
        ? String(deliveryComplement).trim()
        : null
    this.deliveryDistrict =
      deliveryDistrict != null && String(deliveryDistrict).trim() !== ''
        ? String(deliveryDistrict).trim()
        : null
    this.deliveryCity = String(deliveryCity).trim()
    this.deliveryState = String(deliveryState).trim().toUpperCase().slice(0, 2)
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
}
