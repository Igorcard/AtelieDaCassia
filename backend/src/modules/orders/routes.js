import { Router } from 'express'
import { authMiddleware } from '../../shared/middlewares/auth-middleware.js'
import { asyncHandler } from '../../shared/middlewares/async-handler-middleware.js'
import * as ordersController from './controllers/orders-controller.js'

const ordersRouter = Router()

ordersRouter.post('/orders', authMiddleware, asyncHandler(ordersController.createOrder))

export default ordersRouter
