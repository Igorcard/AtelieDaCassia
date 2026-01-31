import prisma from '../../../shared/infra/prisma/client.js'

export async function create(payload){
  const inventory = await prisma.inventory.create({
    data: payload,
  })
  return inventory
}

export async function findBy(params){
  const inventory = await prisma.inventory.findUnique({
    where: params,
  })
  return inventory
}
