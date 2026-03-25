import crypto from 'crypto'

export function verifyMercadoPagoWebhookSignature({
  secret,
  xSignature,
  xRequestId,
  dataId,
}) {
  if (!secret || !xSignature) {
    return false
  }

  const parsed = parseSignatureHeader(xSignature)
  if (!parsed?.v1 || !parsed.ts) {
    return false
  }

  const manifest = buildSignatureManifest({
    dataId,
    xRequestId,
    ts: parsed.ts,
  })

  const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex')

  try {
    const a = Buffer.from(expected, 'hex')
    const b = Buffer.from(parsed.v1, 'hex')
    if (a.length !== b.length) {
      return false
    }
    return crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}

function parseSignatureHeader(xSignature) {
  const parts = String(xSignature).split(',')
  let ts
  let v1
  for (const part of parts) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    const key = part.slice(0, idx).trim()
    const value = part.slice(idx + 1).trim()
    if (key === 'ts') ts = value
    else if (key === 'v1') v1 = value
  }
  return { ts, v1 }
}

function buildSignatureManifest({ dataId, xRequestId, ts }) {
  let manifest = ''
  if (dataId != null && String(dataId).trim() !== '') {
    const raw = String(dataId).trim()
    const forManifest = /^[a-zA-Z0-9]+$/.test(raw) ? raw.toLowerCase() : raw
    manifest += `id:${forManifest};`
  }
  if (xRequestId != null && String(xRequestId).trim() !== '') {
    manifest += `request-id:${String(xRequestId).trim()};`
  }
  if (ts != null && String(ts).trim() !== '') {
    manifest += `ts:${String(ts).trim()};`
  }
  return manifest
}
