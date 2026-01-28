export class User {
  constructor({ email, id, name }) {
    this.email = email
    this.id = id
    this.name = name
    this.role = 'client'
    this.createdAt = new Date()
  }
}
