import { validateSchema } from '../../../shared/utils/helpers/validator-helper.js'

const schemas = {
  updateUser: {
    name: {
      type: 'string',
      required: false,
    },
    roleId: {
      type: 'number',
      required: false,
    },
    password: {
      type: 'string',
      required: false,
    },
  },
}

export class UpdateUserDTO {
  constructor(body) {
    validateSchema(body, schemas.updateUser)
    if (body.name !== undefined) {
      this.name = String(body.name)
    }
    if (body.roleId !== undefined) {
      this.roleId = Number(body.roleId)
    }
    if (body.password !== undefined) {
      this.password = String(body.password)
    }
  }
}
