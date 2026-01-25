import { badRequest, notFound, unauthorized, badGateway, internalServerError, conflict } from '../utils/helpers/result-helper.js'
import { BadRequestException, UnauthorizedException, NotFoundException, InternalServerErrorException, BadGatewayException, ConflictException } from '../types/result-classes.js'

export function errorHandler(error, res) {
  if (error instanceof BadRequestException) {
    return badRequest(res, error.message)
  }

  if (error instanceof NotFoundException) {
    return notFound(res, error.message)
  }

  if (error instanceof InternalServerErrorException) {
    return internalServerError(res, error.message)
  }

  if (error instanceof BadGatewayException) {
    return badGateway(res, error.message)
  }

  if (error instanceof UnauthorizedException) {
    return unauthorized(res, error.message)
  }

  if (error instanceof ConflictException) {
    return conflict(res, error.message)
  }

  return internalServerError(res, error)
}
