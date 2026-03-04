export class User {
  constructor({ email, id, name, roleId }) {
    this.email = email
    this.id = id
    this.name = name
    this.roleId = roleId
    this.createdAt = new Date()
  }
}
