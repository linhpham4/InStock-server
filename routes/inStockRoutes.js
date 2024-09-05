import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";

const router = express.Router();

router.route("/warehouses/:warehouseId").delete(warehouseController.remove);

export default router;
