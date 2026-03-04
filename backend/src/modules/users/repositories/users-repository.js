import prisma from '../../../shared/infra/prisma/client.js'

export async function create(payload){
  const user = await prisma.user.create({
    data: payload,
  })
  return user
}

export async function findBy(params) {
  const user = await prisma.user.findUnique({
    where: params,
  })
  return user
}

export async function update(id, payload) {
  const user = await prisma.user.update({
    where: { id },
    data: payload,
  })
  return user
}

export async function remove(id) {
  await prisma.user.delete({ where: { id } })
}

export async function findAll() {
  const users = await prisma.user.findMany()
  return users
}
