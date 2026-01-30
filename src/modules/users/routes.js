import { Router } from 'express'
import { asyncHandler } from '../../shared/middlewares/async-handler-middleware.js'
import * as usersController from './controllers/users-controller.js'
import { authMiddleware } from '../../shared/middlewares/auth-middleware.js'
import { requireRole } from '../../shared/middlewares/role-middleware.js'
import { USERS_ROLES } from '../usersroles/helper/usersroles-helper.js'

const usersRouter = Router()

usersRouter.post('/users', asyncHandler(usersController.createUser))

usersRouter.put('/users/:id', authMiddleware, asyncHandler(usersController.updateUser))

usersRouter.delete('/users/:id', authMiddleware, asyncHandler(usersController.deleteUser))

usersRouter.get('/users/:id', authMiddleware, asyncHandler(usersController.getUser))

usersRouter.get('/users', authMiddleware, requireRole(USERS_ROLES.ADMIN), asyncHandler(usersController.getUsers))

usersRouter.post('/login', asyncHandler(usersController.loginUser))

export default usersRouter
