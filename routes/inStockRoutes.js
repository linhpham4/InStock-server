import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

import * as warehouseController from "../controllers/warehouse-controller.js";
import * as inventoryController from "../controllers/inventory-controller.js";

const router = express.Router();

// Warehouse routes
router
    .route("/warehouses/:warehouseId")
    .delete(warehouseController.remove);

router
    .route('/warehouses')
    .get(warehouseController.getWarehouses)
    .post(warehouseController.addNew);

// Inventory routes
router
    .route("/inventories")
    .get(inventoryController.getAll)

router
    .route("/inventories/:itemId")
    .get(inventoryController.getSingleInventory)


export default router;
