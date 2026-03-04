import { BadRequestException } from '../../types/result-classes.js'

export function validateSchema(data, schema) {
  const errors = []

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(field)
      continue
    }

    if (!rules.required && (value === undefined || value === null)) {
      continue
    }

    if (rules.type === 'string') {
      if (typeof value !== 'string' || (rules.minLength && value.trim().length < rules.minLength)) {
        errors.push(field)
        continue
      }
    }

    if (rules.type === 'number') {
      const numValue = Number(value)
      if (Number.isNaN(numValue)) {
        errors.push(field)
        continue
      }
      if (rules.min !== undefined && numValue < rules.min) {
        errors.push(field)
        continue
      }
      if (rules.max !== undefined && numValue > rules.max) {
        errors.push(field)
        continue
      }
    }

    if (rules.type === 'boolean') {
      if (typeof value !== 'boolean') {
        errors.push(field)
        continue
      }
    }

    if (rules.custom && typeof rules.custom === 'function') {
      if (!rules.custom(value)) {
        errors.push(field)
      }
    }
  }

  if (errors.length > 0) {
    throw new BadRequestException(`Invalid values for fields: [${errors.join(', ')}]`)
  }
}
