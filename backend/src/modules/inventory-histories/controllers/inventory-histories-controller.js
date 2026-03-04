import { ok } from '../../../shared/utils/helpers/result-helper.js'
import { InventoryHistoryResponseDTO, InventoryHistoriesResponseDTO } from '../dtos/inventory-histories-get-dto.js'
import { GetInventoryHistoriesDTO } from '../dtos/inventory-histories-get-dto.js'
import * as inventoryHistoriesService from '../services/inventory-histories-service.js'

export async function getInventoryHistories(req, res) {
  const dto = new GetInventoryHistoriesDTO(req.body)
  const inventoryHistories = await inventoryHistoriesService.getInventoryHistories(dto)
  return ok(res, new InventoryHistoriesResponseDTO(inventoryHistories))
}

export async function getInventoryHistory(req, res) {
  const inventoryHistory = await inventoryHistoriesService.getInventoryHistory(Number(req.params.productId))
  return ok(res, new InventoryHistoryResponseDTO(inventoryHistory))
}
