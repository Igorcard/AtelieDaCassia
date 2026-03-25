import prisma from '../../../shared/infra/prisma/client.js'

export async function findByOrderId(orderId) {
  return prisma.payment.findUnique({
    where: { orderId },
  })
}

export async function findByExternalPreferenceId(externalPreferenceId) {
  return prisma.payment.findFirst({
    where: { externalPreferenceId },
  })
}

export async function findByExternalPaymentId(externalPaymentId) {
  return prisma.payment.findFirst({
    where: { externalPaymentId },
  })
}

export async function create(data) {
  return prisma.payment.create({ data })
}

export async function updateByOrderId(orderId, data) {
  return prisma.payment.update({
    where: { orderId },
    data,
  })
}
