import { verifyToken } from '../utils/helpers/auth-helper.js'
import { UnauthorizedException } from '../types/result-classes.js'

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException('Missing token')

  const token = auth.slice('Bearer '.length)

  try {
    const decoded = verifyToken(token)
    req.user = decoded
    return next()
  } catch {
    throw new UnauthorizedException('Invalid token')
  }
}
