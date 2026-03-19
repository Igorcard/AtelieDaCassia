import { Router } from 'express'
import { authMiddleware } from '../../shared/middlewares/auth-middleware.js'
import { asyncHandler } from '../../shared/middlewares/async-handler-middleware.js'
import * as shippingController from './controllers/shipping-controller.js'

const shippingRouter = Router()

shippingRouter.post('/shipping/quote', authMiddleware, asyncHandler(shippingController.quote))

export default shippingRouter
