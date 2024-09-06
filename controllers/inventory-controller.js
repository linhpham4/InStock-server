import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const getAll = async (req, res) => {
  try {
    const inventory = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .select(
        "inventories.id",
        "warehouse_name",
        "item_name",
        "description",
        "category",
        "status",
        "quantity"
      );
    if (inventory.length === 0) {
      res.status(404).json("Not found");
    }
    res.status(200).json(inventory);
  } catch (error) {
    console.error(error);
    res.status(400).json("Bad request");
  }
};

// Create new inventory item
const addNewItem = async (req, res) => {
  try {
    // checks that request contains all required data
    if (!req.body.warehouse_id || !req.body.item_name || !req.body.description || !req.body.category || !req.body.status || !req.body.quantity) {
      return res.status(400).json("Please provide all required item information");
    };
    
    // checks if a warehouse in the warehouses table has an id matching warehouse_id from the request
    const warehouses = await knex("warehouses");
    if (!warehouses.find((warehouse) => warehouse.id === req.body.warehouse_id)) {
      return res.status(400).json(`Warehouse with ID ${req.body.warehouse_id} cannot be found`);
    };

    // checks if the value of "quantity" is a number
    if (typeof req.body.quantity !== "number") {
      return res.status(400).json("Quantity must be a number");
    };
    
    const updatedInventory = await knex("inventories").insert(req.body);
    const newItemId = updatedInventory[0];
    const newItem = await knex("inventories")
      .where({ id: newItemId })
      .select(
        "id",
        "warehouse_id",
        "item_name",
        "description",
        "category",
        "status",
        "quantity"
      );

    res.status(201).json(newItem[0]);
  } catch (error) {
    res.status(500).json(`${error}`);
  }
}

export { getAll, addNewItem };
