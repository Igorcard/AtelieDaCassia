import prisma from '../../../shared/infra/prisma/client.js'

export async function create(payload){
  const order = await prisma.orders.create({
    data: payload,
  })
  return order
}

export async function findBy(params) {
  const order = await prisma.orders.findUnique({
    where: params,
  })
  return order
}

export async function update(params, payload) {
  const order = await prisma.orders.update({
    where: params,
    data: payload,
  })
  return order
}

export async function remove(params) {
  await prisma.orders.delete({ where: params })
}

export async function findMany(params) {
  const orders = await prisma.orders.findMany(params)
  return orders
}
