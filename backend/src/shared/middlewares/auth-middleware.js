import { getUserFromToken } from '../utils/helpers/supabase-helper.js'
import { UnauthorizedException } from '../types/result-classes.js'
import * as usersRepository from '../../modules/users/repositories/users-repository.js'

export async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      throw new UnauthorizedException('Token missing')
    }

    const { id } = await getUserFromToken(token)

    const user = await usersRepository.findBy({ id })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    req.user = {
      id: user.id,
      email: user.email,
      roleId: user.roleId
    }

    return next()
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      return next(error)
    }
    return next(new UnauthorizedException('Invalid token'))
  }
}
