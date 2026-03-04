import { validateSchema } from '../../../shared/utils/helpers/validator-helper.js'

const schemas = {
  loginUser: {
    email: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true,
    },
  },
}


export class LoginUserDTO {
  constructor(body) {
    validateSchema(body, schemas.loginUser)
    if (body.email !== undefined) {
      this.email = String(body.email).trim().toLowerCase()
    }
    if (body.password !== undefined) {
      this.password = String(body.password)
    }
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
