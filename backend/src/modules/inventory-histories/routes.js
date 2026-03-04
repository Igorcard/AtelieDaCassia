import { Router } from 'express'
import { asyncHandler } from '../../shared/middlewares/async-handler-middleware.js'
import { authMiddleware } from '../../shared/middlewares/auth-middleware.js'
import { requireRole } from '../../shared/middlewares/role-middleware.js'
import { USERS_ROLES } from '../users-roles/helper/users-roles-helper.js'
import * as inventoryHistoriesController from './controllers/inventory-histories-controller.js'

const inventoryHistoriesRouter = Router()

inventoryHistoriesRouter.post('/inventory-histories', authMiddleware, requireRole(USERS_ROLES.ADMIN), asyncHandler(inventoryHistoriesController.getInventoryHistories))
inventoryHistoriesRouter.get('/inventory-histories/:productId', authMiddleware, requireRole(USERS_ROLES.ADMIN), asyncHandler(inventoryHistoriesController.getInventoryHistory))

export default inventoryHistoriesRouter
