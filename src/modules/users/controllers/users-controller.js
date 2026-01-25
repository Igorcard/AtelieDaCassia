import * as usersService from '../services/users-service.js'
import { ok } from '../../../shared/utils/helpers/result-helper.js'
import { CreateUserDTO } from '../dtos/users-create-dto.js'
import { LoginUserDTO, LoginUserResponseDTO } from '../dtos/users-login-dto.js'
import { UsersResponseDTO, UserResponseDTO } from '../dtos/users-get-dto.js'
import { UpdateUserDTO } from '../dtos/users-update-dto.js'

export async function createUser(req, res) {
  const dto = new CreateUserDTO(req.body)
  const user = await usersService.createUser(dto)
  return ok(res, new UserResponseDTO(user))
}

export async function loginUser(req, res) {
  const dto = new LoginUserDTO(req.body)
  const token = await usersService.loginUser(dto)
  return ok(res, new LoginUserResponseDTO(token))
}

export async function getUsers(req, res) {
  const users = await usersService.getUsers()
  return ok(res, new UsersResponseDTO(users))
}

export async function getUser(req, res) {
  const user = await usersService.getUser(req.params.id)
  return ok(res, new UserResponseDTO(user))
}

export async function updateUser(req, res) {
  const dto = new UpdateUserDTO(req.body)
  const user = await usersService.updateUser(req.params.id, dto)
  return ok(res, new UserResponseDTO(user))
}

export async function deleteUser(req, res) {
  const result = await usersService.deleteUser(req.params.id)
  return ok(res, result)
}
