import { BadRequestException } from '../../../shared/types/result-classes.js'

export class User {
  constructor({ email, passwordHash }) {
    if (!email) throw new BadRequestException('Email is required')
    if (!email.includes('@')) throw new BadRequestException('Email is invalid')

    this.email = email
    this.password = passwordHash
    this.createdAt = new Date()
  }

  static async create({ email, password, hashPassword }) {
    if (!password || password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters')
    }

    const passwordHash = await hashPassword(password)
    return new User({ email, passwordHash })
  }
}
