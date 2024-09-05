import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

import * as warehouseController from "../controllers/warehouse-controller.js";
import * as inventoryController from "../controllers/inventory-controller.js";

const router = express.Router();

router.route("/warehouses/:warehouseId").delete(warehouseController.remove);

router.route("/warehouses").post(warehouseController.addNew);

router.route("/inventories").get(inventoryController.getAll);

export default router;
