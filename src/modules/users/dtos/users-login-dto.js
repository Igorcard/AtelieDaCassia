export class LoginUserDTO {
  constructor({ email, password }) {
    this.email = String(email ?? '').trim().toLowerCase()
    this.password = String(password ?? '')
  }
}

export class LoginUserResponseDTO {
  constructor(token) {
    this.token = token
  }
}
