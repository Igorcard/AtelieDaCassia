import { OrderStatus } from '../../../shared/types/orders-status.js'

export class Order {
  constructor({ userId, status, total }) {
    this.userId = String(userId).trim()
    this.status = OrderStatus[String(status).trim()]
    this.total = Number(total)
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
}
