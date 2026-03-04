import { validateSchema } from '../../../shared/utils/helpers/validator-helper.js'

const schemas = {
  createUser: {
    email: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    roleId: {
      type: 'number',
      required: true,
    },
  }
}

export class CreateUserDTO {
  constructor(body) {
    validateSchema(body, schemas.createUser)
    if (body.email !== undefined) {
      this.email = String(body.email).trim().toLowerCase()
    }
    if (body.password !== undefined) {
      this.password = String(body.password)
    }
    if (body.name !== undefined) {
      this.name = String(body.name)
    }
    if (body.roleId !== undefined) {
      this.roleId = Number(body.roleId)
    }
  }
}
