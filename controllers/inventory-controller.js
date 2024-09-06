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

const edit = async (req, res) => {
  const id = req.params.itemId;
  const request = req.body;
  try {
    if (
      request.id &&
      request.warehouse_id &&
      request.item_name &&
      request.description &&
      request.category &&
      request.status &&
      request.quantity
    ) {
      await knex("inventories").where({ id }).update(req.body);
      const updatedInventory = await knex("inventories").where({ id });
      res.status(200).json(updatedInventory);
    } else {
      res
        .status(500)
        .json(
          "Bad request. All edit requests must have all keys with non-empty values"
        );
    }
  } catch (error) {
    console.error(error);
    res.status(404).json("Not found");
  }
};

// Create new inventory item
const addNewItem = async (req, res) => {
  try {
    // checks that request contains all required data
    ////// !req.body.quantity will not work for cases where quantity is zero (as !0 is truthy)
    ////// so we need to check if it's undefined
    if (!req.body.warehouse_id || !req.body.item_name || !req.body.description || !req.body.category || !req.body.status || req.body.quantity === undefined ) {
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

export { getAll, edit, addNewItem };
