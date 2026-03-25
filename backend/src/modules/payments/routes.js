import { Router } from 'express'
import { authMiddleware } from '../../shared/middlewares/auth-middleware.js'
import { asyncHandler } from '../../shared/middlewares/async-handler-middleware.js'
import * as paymentsController from './controllers/payments-controller.js'

const paymentsRouter = Router()

paymentsRouter.post(
  '/payments/mercadopago/checkout',
  authMiddleware,
  asyncHandler(paymentsController.createMercadoPagoCheckout),
)

export default paymentsRouter
