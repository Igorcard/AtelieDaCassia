import dotenv from 'dotenv'
import { ConflictException, InternalServerErrorException, NotFoundException } from '../../../shared/types/result-classes.js'
import { Product } from '../entities/product-entity.js'
import { InventoryHistoriesType } from '../../inventoryHistories/entities/inventory-histories-type-entity.js'
import * as productsRepository from '../repositories/products-repository.js'
import * as inventoryRepository from '../../inventory/repositories/inventory-repository.js'
import { withTransaction } from '../../../shared/utils/helpers/transaction-helper.js'

dotenv.config()

export async function createProduct(dto) {
  const existingProduct = await productsRepository.findBy({ sku: dto.sku })
  if (existingProduct) {
    throw new ConflictException({ message: 'Product already exists' })
  }

  const productEntity = new Product(dto)

  return withTransaction(async (tx) => {

    const product = await tx.products.create({
      data: {
        description: productEntity.description,
        sku: productEntity.sku,
        salePrice: productEntity.salePrice,
        costPrice: productEntity.costPrice,
        active: productEntity.active
      }
    })

    const inventory = await tx.inventory.create({
      data: {
        quantity: dto.quantity,
        productId: product.id
      }
    })

    await tx.inventoryHistories.create({
      data: {
        quantity: dto.quantity,
        productId: product.id,
        type: InventoryHistoriesType.CREATED,
        referenceId: product.id
      }
    })

    return { product, inventory }
  })
}

export async function getProducts(dto) {
  let products
  const page = Number.isFinite(dto.page) ? Math.max(1, dto.page) : 1
  const limit = Number.isFinite(dto.limit) ? Math.max(1, dto.limit) : 20
  const skip = (page - 1) * limit

  const where = {}
  if (dto.description) {
    where.description = { contains: dto.description, mode: 'insensitive' }
  }

  if (dto.sku) {
    where.sku = { contains: dto.sku, mode: 'insensitive' }
  }

  if (dto.salePrice) {
    where.salePrice = { equals: dto.salePrice }
  }

  if (dto.costPrice) {
    where.costPrice = { equals: dto.costPrice }
  }

  if (dto.active) {
    where.active = { equals: dto.active }
  }

  const allowedOrderBy = new Set(['id', 'createdAt', 'updatedAt', 'description', 'sku', 'salePrice', 'costPrice', 'active'])
  const orderByField = allowedOrderBy.has(dto.orderBy) ? dto.orderBy : 'createdAt'
  const orderDirection = dto.orderDirection === 'asc' ? 'asc' : 'desc'
  const orderBy = { [orderByField]: orderDirection }
  try {
    products = await productsRepository.findMany({ where, skip, take: limit, orderBy })
  } catch (error) {
    console.error(error)
    throw new InternalServerErrorException({ message: 'Failed to get products', error: error.message })
  }

  if (!products || products.length === 0) {
    throw new NotFoundException({ message: 'Products not found' })
  }

  products = await Promise.all(products.map(async (product) => {
    const inventory = await inventoryRepository.findBy({ productId: product.id })
    product.inventory = inventory
    return product
  }))

  return products
}

export async function getProduct(id) {
  let product

  try {
    product = await productsRepository.findBy({ id: Number(id) })
  } catch (error) {
    console.error(error)
    throw new InternalServerErrorException({ message: 'Failed to get product', error: error.message })
  }

  if (!product) {
    throw new NotFoundException({ message: 'Product not found' })
  }

  const inventory = await inventoryRepository.findBy({ productId: product.id })

  product.inventory = inventory

  return product
}

export async function updateProduct(id, dto) {
  await verifyProductExists({id: Number(id)})

  let product

  try {
    product = await productsRepository.update({id: Number(id)}, dto)
  } catch (error) {
    console.error(error)
    throw new InternalServerErrorException({ message: 'Failed to update product', error: error.message })
  }

  return product
}

export async function deleteProduct(id) {
  await verifyProductExists({id: Number(id)})

  try {
    await productsRepository.remove({id: Number(id)})
    return { message: 'Product deleted successfully' }
  } catch (error) {
    console.error(error)
    throw new InternalServerErrorException({ message: 'Failed to delete product', error: error.message })
  }
}

async function verifyProductExists(params) {
  let product

  try {
    product = await productsRepository.findBy(params)
  } catch (error) {
    console.error(error)
    throw new InternalServerErrorException({ message: 'Failed to get product', error: error.message })
  }

  if (!product) {
    throw new NotFoundException('Product not found')
  }

  return product
}
