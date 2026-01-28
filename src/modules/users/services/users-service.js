import dotenv from 'dotenv'
import * as usersRepository from '../repositories/users-repository.js'
import * as supabaseHelper from '../../../shared/utils/helpers/supabase-helper.js'
import { ConflictException, InternalServerErrorException, NotFoundException, BadRequestException, UnauthorizedException } from '../../../shared/types/result-classes.js'
import { User } from '../entities/user-entity.js'

dotenv.config()

export async function createUser(dto) {
  const { email, password, name } = dto

  try {
    const { id } = await supabaseHelper.signUpUser({ email, password })

    const userEntity = new User({ id, email, name })

    const user = await usersRepository.create(userEntity)

    return {
      id: user.id,
      email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    }

  } catch (error) {
    if (error.message.includes('already registered')) {
      throw new ConflictException('Email already exists')
    }
    throw new BadRequestException(error.message)
  }
}

export async function loginUser(dto) {
  const { email, password } = dto

  try {
    const { id, accessToken } = await supabaseHelper.signInUser({ email, password })

    const user = await usersRepository.findBy({id})

    return {
      id,
      email,
      name: user?.name,
      role: user?.role,
      token: accessToken,
    }

  } catch (error) {
    throw new UnauthorizedException('Invalid credentials')
  }
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
