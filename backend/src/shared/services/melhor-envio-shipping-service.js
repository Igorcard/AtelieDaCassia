import {
  BadGatewayException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '../types/result-classes.js'
import * as gatewaysRepository from '../../modules/gateways/repositories/gateways-repository.js'

export const SHIPMENT_CALCULATE_CODE = 'SHIPMENT_CALCULATE'

function envTrim(key) {
  const v = process.env[key]
  return v != null && String(v).trim() !== '' ? String(v).trim() : null
}

function digitsPostal(value) {
  const d = String(value).replace(/\D/g, '')
  return d.length === 8 ? d : null
}

function defaultPackaging() {
  const w = Number(envTrim('MELHOR_ENVIO_DEFAULT_WEIGHT_KG') ?? '0.3')
  const len = parseInt(envTrim('MELHOR_ENVIO_DEFAULT_LENGTH_CM') ?? '16', 10)
  const wid = parseInt(envTrim('MELHOR_ENVIO_DEFAULT_WIDTH_CM') ?? '11', 10)
  const h = parseInt(envTrim('MELHOR_ENVIO_DEFAULT_HEIGHT_CM') ?? '2', 10)
  return {
    weight: Number.isFinite(w) && w > 0 ? w : 0.3,
    length: Number.isFinite(len) && len > 0 ? len : 16,
    width: Number.isFinite(wid) && wid > 0 ? wid : 11,
    height: Number.isFinite(h) && h > 0 ? h : 2,
  }
}

function buildProductPayload(product, quantity, unitPriceBrl, defaults) {
  const w =
    product.shippingWeightKg != null
      ? Number(product.shippingWeightKg)
      : defaults.weight
  const length = product.shippingLengthCm ?? defaults.length
  const width = product.shippingWidthCm ?? defaults.width
  const height = product.shippingHeightCm ?? defaults.height
  return {
    id: String(product.sku),
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(height)),
    length: Math.max(1, Math.round(length)),
    weight: Math.max(0.01, Math.round(w * 1000) / 1000),
    insurance_value: Math.round(unitPriceBrl * 100) / 100,
    quantity: Math.max(1, quantity),
  }
}

function buildCalculateUrl(baseUrl, path) {
  const base = String(baseUrl).replace(/\/$/, '')
  const p = String(path).startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

function validQuotesFromResponse(data) {
  if (!Array.isArray(data)) return []
  return data.filter(
    (q) =>
      q &&
      q.custom_price != null &&
      !Number.isNaN(parseFloat(String(q.custom_price).replace(',', '.'))),
  )
}

export async function calculateShippingFromLines(lines, toPostal) {
  const gatewayCode = envTrim('SHIPPING_GATEWAY_CODE') || 'MELHOR_ENVIO'
  const token = envTrim('MELHOR_ENVIO_TOKEN')

  const userAgent = envTrim('MELHOR_ENVIO_USER_AGENT')
  const originPostal = digitsPostal(
    envTrim('MELHOR_ENVIO_ORIGIN_POSTAL_CODE') || '',
  )

  if (!token) {
    throw new InternalServerErrorException(
      'MELHOR_ENVIO_TOKEN is not configured',
    )
  }
  if (!userAgent) {
    throw new InternalServerErrorException(
      'MELHOR_ENVIO_USER_AGENT is required (e.g. AppName (suporte@email.com))',
    )
  }
  if (!originPostal) {
    throw new InternalServerErrorException(
      'MELHOR_ENVIO_ORIGIN_POSTAL_CODE must be a valid 8-digit CEP',
    )
  }

  const toDigits = digitsPostal(toPostal)
  if (!toDigits) {
    throw new BadRequestException({
      message: 'Invalid destination postal code (CEP)',
    })
  }

  const gateway = await gatewaysRepository.findActiveGatewayByCode(gatewayCode)
  if (!gateway) {
    throw new NotFoundException({
      message: `Gateway not found or inactive: ${gatewayCode}`,
    })
  }
  const endpoint = gatewaysRepository.getEndpointByCode(
    gateway,
    SHIPMENT_CALCULATE_CODE,
  )
  if (!endpoint) {
    throw new NotFoundException({
      message: `Endpoint ${SHIPMENT_CALCULATE_CODE} not registered for gateway ${gatewayCode}`,
    })
  }

  const defaults = defaultPackaging()
  const products = lines.map(({ product, quantity, unitPriceBrl }) =>
    buildProductPayload(product, quantity, unitPriceBrl, defaults),
  )

  const body = {
    from: { postal_code: originPostal },
    to: { postal_code: toDigits },
    products,
    options: { receipt: false, own_hand: false },
  }
  const services = envTrim('MELHOR_ENVIO_SERVICES')
  if (services) {
    body.services = services
  }

  const url = buildCalculateUrl(gateway.baseUrl, endpoint.path)
  let res
  try {
    res = await fetch(url, {
      method: endpoint.httpMethod || 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Agent': userAgent,
      },
      body: JSON.stringify(body),
    })
  } catch (err) {
    throw new BadGatewayException({
      message: `Melhor Envio request failed: ${err?.message || 'network error'}`,
    })
  }

  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new BadGatewayException({
      message: 'Melhor Envio returned invalid JSON',
    })
  }

  if (!res.ok) {
    const hint =
      typeof data === 'object' && data != null
        ? JSON.stringify(data).slice(0, 500)
        : String(text).slice(0, 300)
    throw new BadGatewayException({
      message: `Melhor Envio API HTTP ${res.status}: ${hint}`,
    })
  }

  const quotes = validQuotesFromResponse(data)
  if (quotes.length === 0) {
    throw new BadRequestException({
      message: 'No shipping quotes available for this destination or cart',
    })
  }

  let cheapest = quotes[0]
  let min = parseFloat(String(cheapest.custom_price).replace(',', '.'))
  for (const q of quotes) {
    const p = parseFloat(String(q.custom_price).replace(',', '.'))
    if (p < min) {
      min = p
      cheapest = q
    }
  }
  const shippingBrl = Math.round(min * 100) / 100

  return {
    shippingBrl,
    cheapest,
    quotes,
  }
}
