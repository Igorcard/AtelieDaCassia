export class UpdateUserDTO {
  constructor(body) {
    this.name = String(body.name ?? '')
    this.roleId = Number(body.roleId ?? 1)
    this.password = String(body.password ?? '')
  }
}
