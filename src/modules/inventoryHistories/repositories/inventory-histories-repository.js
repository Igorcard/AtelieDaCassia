import prisma from '../../../shared/infra/prisma/client.js'

export async function create(payload){
  const inventoryHistory = await prisma.inventoryHistories.create({
    data: payload,
  })
  return inventoryHistory
}
