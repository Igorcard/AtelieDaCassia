import { Router } from 'express'
import { authMiddleware } from '../../shared/middlewares/auth-middleware.js'
import { requireRole } from '../../shared/middlewares/role-middleware.js'
import { USERS_ROLES } from '../users-roles/helper/users-roles-helper.js'
import { asyncHandler } from '../../shared/middlewares/async-handler-middleware.js'
import * as inventoryController from './controllers/inventory-controller.js'

const inventoryRouter = Router()

inventoryRouter.put('/inventory/:productId', authMiddleware, requireRole(USERS_ROLES.ADMIN), asyncHandler(inventoryController.updateInventory))
inventoryRouter.get('/inventory/:productId', authMiddleware, requireRole(USERS_ROLES.ADMIN), asyncHandler(inventoryController.getInventory))
inventoryRouter.get('/inventory', authMiddleware, requireRole(USERS_ROLES.ADMIN), asyncHandler(inventoryController.getInventories))
inventoryRouter.post('/inventory/:productId/entry', authMiddleware, requireRole(USERS_ROLES.ADMIN), asyncHandler(inventoryController.createInventoryEntry))
inventoryRouter.post('/inventory/:productId/exit', authMiddleware, requireRole(USERS_ROLES.ADMIN), asyncHandler(inventoryController.createInventoryExit))

export default inventoryRouter
