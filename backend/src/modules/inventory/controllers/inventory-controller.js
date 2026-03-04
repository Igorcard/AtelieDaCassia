import { ok } from '../../../shared/utils/helpers/result-helper.js'
import { UpdateInventoryDTO, UpdateInventoryResponseDTO } from '../dtos/inventory-update-dto.js'
import { InventoryResponseDTO, InventoriesResponseDTO } from '../dtos/inventory-get-dto.js'
import * as inventoryService from '../services/inventory-service.js'

export async function updateInventory(req, res) {
  const dto = new UpdateInventoryDTO(req.body)
  const inventory = await inventoryService.updateInventory(Number(req.params.productId), dto)
  return ok(res, new UpdateInventoryResponseDTO(inventory))
}

export async function getInventory(req, res) {
  const inventory = await inventoryService.getInventory(Number(req.params.productId))
  return ok(res, new InventoryResponseDTO(inventory))
}

export async function getInventories(req, res) {
  const inventories = await inventoryService.getInventories()
  return ok(res, new InventoriesResponseDTO(inventories))
}

export async function createInventoryEntry(req, res) {
  const dto = new UpdateInventoryDTO(req.body)
  const inventory = await inventoryService.createInventoryEntry(Number(req.params.productId), dto)
  return ok(res, new InventoryResponseDTO(inventory))
}

export async function createInventoryExit(req, res) {
  const dto = new UpdateInventoryDTO(req.body)
  const inventory = await inventoryService.createInventoryExit(Number(req.params.productId), dto)
  return ok(res, new InventoryResponseDTO(inventory))
}
