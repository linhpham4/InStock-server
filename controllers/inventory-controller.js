import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Delete an inventory item
const removeItem = async (req, res) => {
  const id = req.params.itemId;

  try {
    const inventoryItem = await knex("inventories").where({ id });
    if (inventoryItem.length === 0) {
      return res.status(404).json(`Item with ID ${id} not found`);
    }
    await knex("inventories").where({ id }).del();
    res.status(204).end();
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};

// Get an inventory item
const getItem = async (req, res) => {
  try {
    const id = req.params.itemId;

    const inventorySingle = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
      .where({ "inventories.id": id })
      .select(
        "inventories.id",
        "warehouse_name",
        "item_name",
        "description",
        "category",
        "status",
        "quantity"
      );

    if (inventorySingle.length === 0) {
      return res.status(404).json(`Item with ID ${id} not found`);
    }

    res.status(200).json(inventorySingle[0]);
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};

// Get all inventory
const getAllItems = async (_req, res) => {
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

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};

// Edit/update an existing resource in its entirety (PUT)
const editItem = async (req, res) => {
  const id = req.params.itemId;
  
  try {

    if (
      !req.body.warehouse_id ||
      !req.body.item_name ||
      !req.body.description ||
      !req.body.category ||
      !req.body.status ||
      req.body.quantity === undefined
    ) {
      return res.status(400).json("Please provide all required item information");
    }

    const warehouses = await knex("warehouses");
    if (!warehouses.find((warehouse) => warehouse.id === req.body.warehouse_id)) {
      return res.status(400).json(`Warehouse with ID ${req.body.warehouse_id} not found`);
    }

    if (typeof req.body.quantity !== "number") {
      return res.status(400).json("Quantity must be a number");
    }

    await knex("inventories").where({ id }).update(req.body);
    const updatedInventory = await knex("inventories")
      .where({ id })
      .select(
        "id",
        "warehouse_id",
        "item_name",
        "description",
        "category",
        "status",
        "quantity"
      )

    if (updatedInventory.length === 0) {
      return res.status(404).json(`Item with ID ${id} not found`);
    }
      
    res.status(200).json(updatedInventory[0]);
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};

// Create new inventory item
const addNewItem = async (req, res) => {
  try {
    // checks that request contains all required data
    ////// !req.body.quantity will not work for cases where quantity is zero (as !0 is truthy)
    ////// so we need to check if it's undefined
    if (
      !req.body.warehouse_id ||
      !req.body.item_name ||
      !req.body.description ||
      !req.body.category ||
      !req.body.status ||
      req.body.quantity === undefined
    ) {
      return res.status(400).json("Please provide all required item information");
    }

    // checks if a warehouse in the warehouses table has an id matching warehouse_id from the request
    const warehouses = await knex("warehouses");
    if (!warehouses.find((warehouse) => warehouse.id === req.body.warehouse_id)) {
      return res.status(400).json(`Warehouse with ID ${req.body.warehouse_id} not found`);
    }

    // checks if the value of "quantity" is a number
    if (typeof req.body.quantity !== "number") {
      return res.status(400).json("Quantity must be a number");
    }

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
};

export { getAllItems, getItem, editItem, removeItem, addNewItem };
