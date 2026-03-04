import prisma from '../../infra/prisma/client.js'
import dotenv from 'dotenv'
import { InternalServerErrorException } from '../../types/result-classes.js'

dotenv.config()

const TRANSACTION_TIMEOUT = Number(process.env.TRANSACTION_TIMEOUT) || 10000

export async function withTransaction(callback, options = {}) {
  const defaultOptions = {
    timeout: TRANSACTION_TIMEOUT,
    ...options
  }

  try {
    const result = await prisma.$transaction(callback, defaultOptions)
    return result
  } catch (error) {
    console.error('[Transaction Error]:', error.message)

    if (error.name && error.name.includes('Exception')) {
      throw error
    }

    throw new InternalServerErrorException({
      message: 'Transaction failed',
      error: error.message
    })
  }
}

export async function withLongTransaction(callback) {
  return withTransaction(callback, { timeout: TRANSACTION_TIMEOUT * 3 })
}

export async function withSerializableTransaction(callback) {
  return withTransaction(callback, {
    isolationLevel: 'Serializable',
    timeout: TRANSACTION_TIMEOUT
  })
}
