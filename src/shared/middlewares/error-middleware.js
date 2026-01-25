import { errorHandler } from '../errors/error-handler.js'

export function errorMiddleware(err, req, res, next) {
  if (res.headersSent) return next(err)

  return errorHandler(err, res)
}
