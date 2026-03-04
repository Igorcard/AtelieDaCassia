export class UsersResponseDTO {
  constructor(users) {
    this.users = users.map(user => new UserResponseDTO(user))
  }
}

export class UserResponseDTO {
  constructor(user) {
    this.id = user.id
    this.email = user.email
    this.name = user.name
    this.roleId = user.roleId
    this.createdAt = user.createdAt
  }
}
