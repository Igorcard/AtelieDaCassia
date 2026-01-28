export class CreateUserDTO {
  constructor(body) {
    this.email = String(body.email ?? '').trim().toLowerCase()
    this.password = String(body.password ?? '')
    this.name = String(body.name ?? '')
  }
}
