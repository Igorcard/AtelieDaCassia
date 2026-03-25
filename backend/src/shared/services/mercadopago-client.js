import dotenv from 'dotenv'
import { BadGatewayException } from '../types/result-classes.js'

dotenv.config()

function getAccessToken() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim()
  if (!token) {
    throw new BadGatewayException({
      message: 'Mercado Pago is not configured (MERCADOPAGO_ACCESS_TOKEN)',
    })
  }
  return token
}

function authHeaders() {
  return {
    Authorization: `Bearer ${getAccessToken()}`,
    'Content-Type': 'application/json',
  }
}

async function parseErrorBody(res) {
  try {
    const text = await res.text()
    if (!text) return res.statusText
    try {
      const j = JSON.parse(text)
      return j.message || j.cause?.message || text
    } catch {
      return text
    }
  } catch {
    return res.statusText
  }
}

export async function createPreference(body) {
  const res = await fetch(`${process.env.MERCADOPAGO_BASE_URL}/checkout/preferences`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const detail = await parseErrorBody(res)
    throw new BadGatewayException({
      message: `Mercado Pago preference request failed: ${String(detail)}`,
    })
  }

  return res.json()
}

export async function getPayment(paymentId) {
  const id = String(paymentId).trim()
  if (!id) {
    throw new BadGatewayException({ message: 'Invalid Mercado Pago payment id' })
  }

  const res = await fetch(`${process.env.MERCADOPAGO_BASE_URL}/v1/payments/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  })

  if (!res.ok) {
    const detail = await parseErrorBody(res)
    throw new BadGatewayException({
      message: `Mercado Pago payment fetch failed: ${String(detail)}`,
    })
  }

  return res.json()
}

export function shouldUseSandboxInitPoint(accessToken) {
  if (process.env.MERCADOPAGO_SANDBOX === 'true') {
    return true
  }
  const t = accessToken ?? getAccessToken()
  return typeof t === 'string' && t.startsWith('TEST-')
}

export function resolveInitPoint(preference) {
  const token = getAccessToken()
  const sandbox = shouldUseSandboxInitPoint(token)
  const url = sandbox
    ? preference.sandbox_init_point || preference.init_point
    : preference.init_point || preference.sandbox_init_point
  if (!url) {
    throw new BadGatewayException({
      message: 'Mercado Pago preference missing init_point',
    })
  }
  return url
}
