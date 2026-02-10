import { ok } from '../../../shared/utils/helpers/result-helper.js'
import { CreateOrderDTO, CreateOrderResponseDTO } from '../dtos/orders-create-dto.js'
import * as ordersService from '../services/orders-service.js'

export async function createOrder(req, res) {
  const dto = new CreateOrderDTO({...req.body, userId: req.user.id})
  const order = await ordersService.createOrder(dto)
  console.log(order)
  return ok(res, new CreateOrderResponseDTO(order))
}
