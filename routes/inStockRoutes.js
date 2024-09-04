import express from "express";
const router = express.Router();
import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

router.delete("/warehouses/:warehouseId", async (req, res) => {
  const id = req.params.warehouseId;
  try {
    const selectedItem = await knex("warehouses").where("id", id).del();

    res.status(200).json(selectedItem);
  } catch (error) {
    console.error(error);
    res.status(404).json("Warehouse not found");
  }
});

export default router;
