import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

import * as warehouseController from "../controllers/warehouse-controller.js";




const router = express.Router();

router.route("/warehouses/:warehouseId").delete(warehouseController.remove);

router.route('/warehouses').post(warehouseController.addNew);

router.route("/warehouses/:warehouseId").get(warehouseController.findWarehouse).patch(warehouseController.update);





export default router;
