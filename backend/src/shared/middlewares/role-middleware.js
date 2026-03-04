import { ForbiddenException, UnauthorizedException } from '../types/result-classes.js'

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.roleId) {
        throw new UnauthorizedException('Authentication required')
      }

      if (!allowedRoles.includes(req.user.roleId)) {
        throw new ForbiddenException('Insufficient permissions')
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
