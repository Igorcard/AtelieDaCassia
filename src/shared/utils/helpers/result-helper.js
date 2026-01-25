'use strict'

export function badRequest(res, message) {
  return res.status(400).json(message)
}

export function emptyOk(res) {
  return res.status(200).send()
}

export function ok(res, data) {
  return res.status(200).json(data)
}
export function created(res, record) {
  return res.status(201).json(record)
}

export function accepted(res, message) {
  return res.status(202).send(message)
}

export function unauthorized(res, message) {
  return res.status(401).json(message)
}

export function forbidden(res, message) {
  return res.status(403).json(message)
}

export function notFound(res, message) {
  return res.status(404).json(message)
}

export function conflict(res, message) {
  return res.status(409).json(message)
}

export function preconditionFailed(res, message) {
  return res.status(412).json(message)
}

export function requestRangeNotSatisfiable(res, message) {
  return res.status(416).json(message)
}

export function expectationFailed(res, response) {
  return res.status(417).json(response)
}

export function locked(res, message) {
  return res.status(423).json(message)
}

export function preconditionRequired(res, message) {
  return res.status(428).json(message)
}

export function tooManyRequests(res, message) {
  return res.status(429).json(message)
}

export function internalServerError(res, message) {
  return res.status(500).json(message)
}

export function loopDetected(res, message) {
  return res.status(508).json(message)
}

export function badGateway(res, message) {
  return res.status(502).json(message)
}

