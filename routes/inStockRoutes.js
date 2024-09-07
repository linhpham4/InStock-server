import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";
import * as inventoryController from "../controllers/inventory-controller.js";

const router = express.Router();

// Warehouse routes
router
  .route("/warehouses/:warehouseId/inventories")
  .get(warehouseController.getInventory);

router
  .route("/warehouses/:warehouseId")
  .delete(warehouseController.removeWarehouse)
  .get(warehouseController.getSingleWarehouse)
  .put(warehouseController.editWarehouse)

router
  .route("/warehouses")
  .get(warehouseController.getAllWarehouses)
  .post(warehouseController.addNewWarehouse);

// Inventory routes
router
  .route("/inventories")
  .get(inventoryController.getAllItem)
  .post(inventoryController.addNewItem);

router
  .route("/inventories/:itemId")
  .get(inventoryController.getItem)
  .put(inventoryController.editItem)
  .delete(inventoryController.removeItem);

export default router;
