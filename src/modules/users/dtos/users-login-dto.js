export class LoginUserDTO {
  constructor(body) {
    this.email = String(body.email ?? '').trim().toLowerCase()
    this.password = String(body.password ?? '')
  }
}

export class LoginUserResponseDTO {
  constructor(user) {
    this.id = user.id
    this.email = user.email
    this.name = user.name
    this.roleId = user.roleId
    this.token = user.token
  }
}
