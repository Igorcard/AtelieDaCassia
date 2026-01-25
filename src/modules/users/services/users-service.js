import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import * as usersRepository from '../repositories/users-repository.js'
import { ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '../../../shared/types/result-classes.js'
import { User } from '../entities/user-entity.js'
import { generateToken } from '../../../shared/utils/helpers/auth-helper.js'

dotenv.config()

export async function createUser({ email, password }) {
  await verifyUserExists({email})

  const userEntity = await User.create({ email, password, hashPassword })

  try {
    const user = await usersRepository.create(userEntity)
    return user
  } catch (error) {
    console.error(error)
    throw new InternalServerErrorException({ message: 'Failed to create user', error: error.message })
  }
}

async function hashPassword(password) {
  const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS_USER_PASSWORD, 10)
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function loginUser({ email, password }) {
  const user = await verifyUserExists({email})

  const isPasswordValid = await verifyPassword(password, user.password)

  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid email or password')
  }

  const token = generateToken(user.id)

  return token
}

async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

export async function getUser(id) {
  const user = await verifyUserExists({id})

  return user
}

export async function getUsers() {
  let users

  try {
    users = await usersRepository.findAll()
  } catch (error) {
    console.error(error)
    throw new InternalServerErrorException({ message: 'Failed to get users', error: error.message })
  }

  if (!users || users.length === 0) {
    throw new NotFoundException('Users not found')
  }

  return users
}

export async function updateUser(id, { email, password }) {
  await verifyUserExists({id})

  try {
    const user = await usersRepository.update(id, { email, password })
    return user
  } catch (error) {
    console.error(error)
    throw new InternalServerErrorException({ message: 'Failed to update user', error: error.message })
  }
}

export async function deleteUser(id) {
  await verifyUserExists({id})

  try {
    await usersRepository.remove(id)
    return { message: 'User deleted successfully' }
  } catch (error) {
    console.error(error)
    throw new InternalServerErrorException({ message: 'Failed to delete user', error: error.message })
  }
}

async function verifyUserExists(params) {
  let user

  try {
    user = await usersRepository.findBy(params)
  } catch (error) {
    console.error(error)
    throw new InternalServerErrorException({ message: 'Failed to get user', error: error.message })
  }

  if (!user) {
    throw new NotFoundException('User not found')
  }

  return user
}
