import { getUserFromToken } from '../utils/helpers/supabase-helper.js'
import { UnauthorizedException } from '../types/result-classes.js'

export async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      throw new UnauthorizedException('Token missing')
    }

    const { id, email } = await getUserFromToken(token)

    req.user = { id, email }

    return next()
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error
    }
    throw new UnauthorizedException('Invalid token')
  }
}
