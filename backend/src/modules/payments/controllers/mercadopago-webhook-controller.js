import { BadRequestException } from '../../../shared/types/result-classes.js'
import * as paymentsService from '../services/payments-service.js'

function parseWebhookJsonBody(req) {
  const raw = req.body
  if (Buffer.isBuffer(raw)) {
    if (raw.length === 0) {
      return {}
    }
    try {
      return JSON.parse(raw.toString('utf8'))
    } catch {
      throw new BadRequestException({ message: 'Invalid webhook JSON body' })
    }
  }
  if (raw && typeof raw === 'object') {
    return raw
  }
  return {}
}

export async function handleMercadoPagoWebhook(req, res) {
  const body = parseWebhookJsonBody(req)
  await paymentsService.processMercadoPagoWebhook({ req, body })
  return res.status(200).send()
}
