import dotenv from 'dotenv'
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '../../../shared/types/result-classes.js'
import * as mercadopagoClient from '../../../shared/services/mercadopago-client.js'
import { verifyMercadoPagoWebhookSignature } from '../../../shared/services/mercadopago-webhook-signature.js'
import { withTransaction } from '../../../shared/utils/helpers/transaction-helper.js'
import * as ordersRepository from '../../orders/repositories/orders-repository.js'
import * as paymentsRepository from '../repositories/payments-repository.js'

dotenv.config()

function requireEnv(name) {
  const v = process.env[name]?.trim()
  if (!v) {
    throw new BadRequestException({
      message: `Missing configuration: ${name}`,
    })
  }
  return v
}

function moneyNumber(value) {
  const n = Number(value)
  if (Number.isNaN(n)) {
    throw new BadRequestException({ message: 'Invalid monetary amount' })
  }
  return Math.round(n * 100) / 100
}

export async function createMercadoPagoCheckout({ orderId, userId }) {
  if (userId == null || String(userId).trim() === '') {
    throw new UnauthorizedException({ message: 'User required' })
  }

  const id = Number(orderId)
  if (!Number.isInteger(id) || id < 1) {
    throw new BadRequestException({ message: 'Invalid orderId' })
  }

  const order = await ordersRepository.findByIdWithCheckoutData(id, String(userId))
  if (!order) {
    throw new NotFoundException({ message: 'Order not found' })
  }

  if (order.status !== 'PENDING') {
    throw new ConflictException({
      message: 'Order is not pending payment',
    })
  }

  if (order.payment?.status === 'APPROVED') {
    throw new ConflictException({ message: 'Order payment already approved' })
  }

  const apiPublicUrl = requireEnv('API_PUBLIC_URL').replace(/\/$/, '')
  const frontendUrl = requireEnv('FRONTEND_APP_URL').replace(/\/$/, '')
  const total = moneyNumber(order.total)

  const preferenceBody = {
    items: [
      {
        title: `Pedido #${order.id}`,
        quantity: 1,
        unit_price: total,
      },
    ],
    external_reference: String(order.id),
    notification_url: `${apiPublicUrl}/webhooks/mercadopago`,
    back_urls: {
      success: `${frontendUrl}/payment/success`,
      failure: `${frontendUrl}/payment/failure`,
      pending: `${frontendUrl}/payment/pending`,
    },
    auto_return: 'approved',
  }

  const preference = await mercadopagoClient.createPreference(preferenceBody)
  const preferenceId = preference.id != null ? String(preference.id) : null
  if (!preferenceId) {
    throw new BadRequestException({
      message: 'Mercado Pago preference response missing id',
    })
  }

  const initPoint = mercadopagoClient.resolveInitPoint(preference)

  const paymentPayload = {
    orderId: order.id,
    provider: 'MERCADOPAGO',
    status: 'PENDING',
    amount: total,
    currency: 'BRL',
    externalPreferenceId: preferenceId,
    metadata: {
      preferenceId: preferenceId,
    },
  }

  if (order.payment) {
    await paymentsRepository.updateByOrderId(order.id, {
      status: 'PENDING',
      amount: total,
      externalPreferenceId: preferenceId,
      externalPaymentId: null,
      metadata: paymentPayload.metadata,
    })
  } else {
    await paymentsRepository.create(paymentPayload)
  }

  return {
    initPoint,
    preferenceId: preferenceId,
  }
}

function mapMpPaymentStatusToPaymentStatus(mpStatus) {
  const s = String(mpStatus || '').toLowerCase()
  if (s === 'approved') return 'APPROVED'
  if (s === 'refunded' || s === 'charged_back') return 'REFUNDED'
  if (s === 'rejected') return 'REJECTED'
  if (s === 'cancelled') return 'CANCELLED'
  if (s === 'pending' || s === 'in_process' || s === 'authorized' || s === 'in_mediation') {
    return 'PROCESSING'
  }
  return 'PROCESSING'
}

export async function processMercadoPagoWebhook({ req, body }) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim()
  if (!secret) {
    throw new InternalServerErrorException({
      message: 'MERCADOPAGO_WEBHOOK_SECRET is not configured',
    })
  }

  const xSignature = req.get('x-signature')
  const xRequestId = req.get('x-request-id')
  const dataIdFromQuery =
    req.query?.['data.id'] != null
      ? String(req.query['data.id'])
      : undefined

  const okSig = verifyMercadoPagoWebhookSignature({
    secret,
    xSignature,
    xRequestId,
    dataId: dataIdFromQuery,
  })

  if (!okSig) {
    throw new UnauthorizedException({ message: 'Invalid webhook signature' })
  }

  const mpPaymentId =
    body?.data?.id != null
      ? String(body.data.id)
      : dataIdFromQuery != null
        ? String(dataIdFromQuery)
        : null

  if (!mpPaymentId) {
    return { ok: true, skipped: true, reason: 'missing_payment_id' }
  }

  const mpPayment = await mercadopagoClient.getPayment(mpPaymentId)
  const externalRef = mpPayment.external_reference
  if (externalRef == null || String(externalRef).trim() === '') {
    return { ok: true, skipped: true, reason: 'missing_external_reference' }
  }

  const orderId = parseInt(String(externalRef).trim(), 10)
  if (!Number.isInteger(orderId) || orderId < 1) {
    return { ok: true, skipped: true, reason: 'invalid_external_reference' }
  }

  const order = await ordersRepository.findByIdWithPayment(orderId)
  if (!order) {
    return { ok: true, skipped: true, reason: 'order_not_found' }
  }

  const paymentRow = order.payment
  if (!paymentRow) {
    return { ok: true, skipped: true, reason: 'payment_row_not_found' }
  }

  if (order.status === 'CONFIRMED' && paymentRow.status === 'APPROVED') {
    return { ok: true, skipped: true, reason: 'already_confirmed' }
  }

  const nextPaymentStatus = mapMpPaymentStatusToPaymentStatus(mpPayment.status)
  const mpIdStr = String(mpPayment.id)

  if (paymentRow.status === 'APPROVED' && nextPaymentStatus === 'APPROVED') {
    if (order.status !== 'CONFIRMED') {
      await withTransaction(async (tx) => {
        await tx.orders.update({
          where: { id: orderId },
          data: { status: 'CONFIRMED' },
        })
      })
    }
    return { ok: true, skipped: true, reason: 'payment_already_approved' }
  }

  await withTransaction(async (tx) => {
    const fresh = await tx.orders.findUnique({
      where: { id: orderId },
      include: { payment: true },
    })
    if (!fresh?.payment) {
      return
    }
    if (fresh.status === 'CONFIRMED' && fresh.payment.status === 'APPROVED') {
      return
    }

    const metadata = {
      ...(typeof fresh.payment.metadata === 'object' && fresh.payment.metadata !== null
        ? fresh.payment.metadata
        : {}),
      lastMpStatus: mpPayment.status,
      lastWebhookAt: new Date().toISOString(),
    }

    await tx.payment.update({
      where: { orderId },
      data: {
        status: nextPaymentStatus,
        externalPaymentId: mpIdStr,
        metadata,
      },
    })

    if (nextPaymentStatus === 'APPROVED') {
      await tx.orders.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      })
    }
  })

  return { ok: true, skipped: false }
}
