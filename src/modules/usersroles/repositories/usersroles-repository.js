import prisma from '../../../shared/infra/prisma/client.js'

export async function findBy(params) {
  const usersRole = await prisma.usersRoles.findUnique({
    where: params,
  })
  return usersRole
}

export async function findAll() {
  const usersRoles = await prisma.usersRoles.findMany()
  return usersRoles
}
