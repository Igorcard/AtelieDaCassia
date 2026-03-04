import prisma from '../../../shared/infra/prisma/client.js'

export async function create(payload){
  const product = await prisma.products.create({
    data: payload,
  })
  return product
}

export async function findBy(params) {
  const product = await prisma.products.findUnique({
    where: params,
  })
  return product
}

export async function update(params, payload) {
  const product = await prisma.products.update({
    where: params,
    data: payload,
  })
  return product
}

export async function remove(params) {
  await prisma.products.delete({ where: params })
}

export async function findMany(params) {
  const products = await prisma.products.findMany(params)
  return products
}
