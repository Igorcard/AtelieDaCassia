import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import { exportRoutes } from '../../utils/routes-exports.js'
import { errorMiddleware } from '../../middlewares/error-middleware.js'
import { asyncHandler } from '../../middlewares/async-handler-middleware.js'
import * as mercadopagoWebhookController from '../../../modules/payments/controllers/mercadopago-webhook-controller.js'

const app = express()

app.use(cors())
app.use(logger('dev'))

app.post(
  '/webhooks/mercadopago',
  express.raw({
    type: (req) => {
      const ct = String(req.headers['content-type'] || '')
      return /^application\/json/i.test(ct.split(';')[0].trim())
    },
  }),
  asyncHandler(mercadopagoWebhookController.handleMercadoPagoWebhook),
)

app.use(express.json({
  limit: '20mb',
}))

app.use(express.urlencoded({
  limit: '20mb',
  parameterLimit: 100000,
  extended: true,
}))

await exportRoutes(app)

app.use(errorMiddleware)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

export { app }
