import prisma from '../../../shared/infra/prisma/client.js'

export async function findActiveGatewayByCode(code) {
  return prisma.gateway.findFirst({
    where: { code, active: true },
    include: { endpoints: true },
  })
}

export function getEndpointByCode(gateway, endpointCode) {
  return gateway?.endpoints?.find((e) => e.code === endpointCode) ?? null
}
