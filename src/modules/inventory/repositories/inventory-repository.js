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


export async function update(params, payload){
  const inventory = await prisma.inventory.update({
    where: params,
    data: payload,
  })
  return inventory
}

export async function findMany(params){
  const inventories = await prisma.inventory.findMany({
    where: params,
  })
  return inventories
}
