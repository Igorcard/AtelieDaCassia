import { ok } from '../../../shared/utils/helpers/result-helper.js'
import { ShippingQuoteDTO } from '../dtos/shipping-quote-dto.js'
import * as shippingService from '../services/shipping-service.js'

export async function quote(req, res) {
  const dto = new ShippingQuoteDTO(req.body)
  const result = await shippingService.quoteShipping(dto)
  return ok(res, result)
}
