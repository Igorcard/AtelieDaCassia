import prisma from '../../../shared/infra/prisma/client.js'

export async function create(payload){
  const inventoryHistory = await prisma.inventoryHistories.create({
    data: payload,
  })
  return inventoryHistory
}

export async function findMany(params) {
  const inventoryHistories = await prisma.inventoryHistories.findMany(params)
  return inventoryHistories
}
