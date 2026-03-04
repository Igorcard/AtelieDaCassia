import { Router } from 'express'
import { asyncHandler } from '../../shared/middlewares/async-handler-middleware.js'
import { authMiddleware } from '../../shared/middlewares/auth-middleware.js'
import { requireRole } from '../../shared/middlewares/role-middleware.js'
import { USERS_ROLES } from '../users-roles/helper/users-roles-helper.js'
import * as productsController from './controllers/products-controller.js'

const productsRouter = Router()

productsRouter.post('/product', authMiddleware, requireRole(USERS_ROLES.ADMIN), asyncHandler(productsController.createProduct))
productsRouter.put('/product/:id', authMiddleware, requireRole(USERS_ROLES.ADMIN), asyncHandler(productsController.updateProduct))
productsRouter.delete('/product/:id', authMiddleware, requireRole(USERS_ROLES.ADMIN), asyncHandler(productsController.deleteProduct))
productsRouter.get('/product/:id', authMiddleware, asyncHandler(productsController.getProduct))
productsRouter.post('/products', authMiddleware, asyncHandler(productsController.getProducts))

export default productsRouter
