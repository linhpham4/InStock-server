import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const remove = async (req, res) => {
  const id = req.params.warehouseId;

  try {
    const warehouseDeleted = await knex("warehouses").where({ id });
    if (warehouseDeleted.length === 0) {
      res.status(404).json("Warehouse not found");
    }
    await knex("warehouses").where({ id }).del();
    res.status(200).json(warehouseDeleted);
  } catch (error) {
    console.error(error);
    res.status(500).json(`Unsuccessful: ${error}`);
  }
};

export { remove };
