import { Router } from 'express'
import { asyncHandler } from '../../shared/middlewares/async-handler-middleware.js'
import * as usersController from './controllers/users-controller.js'
import { authMiddleware } from '../../shared/middlewares/auth-middleware.js'
import { requireRole } from '../../shared/middlewares/role-middleware.js'
import { USERS_ROLES } from '../usersroles/helper/usersroles-helper.js'

const usersRouter = Router()

usersRouter.post('/user', asyncHandler(usersController.createUser))

usersRouter.put('/user/:id', requireRole(USERS_ROLES.ADMIN), authMiddleware, asyncHandler(usersController.updateUser))

usersRouter.delete('/user/:id', requireRole(USERS_ROLES.ADMIN), authMiddleware, asyncHandler(usersController.deleteUser))

usersRouter.get('/users/:id', requireRole(USERS_ROLES.ADMIN), authMiddleware, asyncHandler(usersController.getUser))

usersRouter.get('/users', requireRole(USERS_ROLES.ADMIN), authMiddleware, asyncHandler(usersController.getUsers))

usersRouter.post('/login', asyncHandler(usersController.loginUser))

export default usersRouter
