import { ok } from '../../../shared/utils/helpers/result-helper.js'
import * as paymentsService from '../services/payments-service.js'

export async function createMercadoPagoCheckout(req, res) {
  const { orderId } = req.body ?? {}
  const payload = await paymentsService.createMercadoPagoCheckout({
    orderId,
    userId: req.user?.id,
  })
  return ok(res, payload)
}
