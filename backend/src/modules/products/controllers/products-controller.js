import { ok } from '../../../shared/utils/helpers/result-helper.js'
import { CreateProductDTO, CreateProductResponseDTO } from '../dtos/products-create-dto.js'
import { UpdateProductDTO } from '../dtos/products-update-dto.js'
import { ProductResponseDTO, ProductsResponseDTO, GetProductsDTO } from '../dtos/products-get-dto.js'
import * as productsService from '../services/products-service.js'

export async function createProduct(req, res) {
  const dto = new CreateProductDTO(req.body)
  const product = await productsService.createProduct(dto)
  return ok(res, new CreateProductResponseDTO(product))
}

export async function getProducts(req, res) {
  const dto = new GetProductsDTO(req.body)
  const products = await productsService.getProducts(dto)
  return ok(res, new ProductsResponseDTO(products))
}

export async function updateProduct(req, res) {
  const dto = new UpdateProductDTO(req.body)
  const product = await productsService.updateProduct(req.params.id, dto)
  return ok(res, new ProductResponseDTO(product))
}

export async function deleteProduct(req, res) {
  const result = await productsService.deleteProduct(req.params.id)
  return ok(res, result)
}

export async function getProduct(req, res) {
  const product = await productsService.getProduct(req.params.id)
  return ok(res, new ProductResponseDTO(product))
}
