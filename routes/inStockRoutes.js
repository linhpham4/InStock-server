import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

import * as warehouseController from "../controllers/warehouse-controller.js";




const router = express.Router();

router.route("/warehouses/:warehouseId")
    .delete(warehouseController.remove)
    .get(warehouseController.findWarehouse)

router
    .route('/warehouses')
    .post(warehouseController.addNew);





export default router;
