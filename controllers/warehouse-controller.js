import initKnex from "knex";
import configuration from "../knexfile.js";
import validator from "validator";

const knex = initKnex(configuration);

// Get all warehouses
const getWarehouses = async (_req, res) => {
  try {
    const data = await knex
      .select(
        "id",
        "warehouse_name",
        "address",
        "city",
        "country",
        "contact_name",
        "contact_position",
        "contact_phone",
        "contact_email"
      )
      .from("warehouses");
    res.status(200).json(data);
  } catch (error) {
    res.status(400).send(`Error retrieving warehouses: ${error}`);
  }
};

// Delete a warehouse
const remove = async (req, res) => {
  const id = req.params.warehouseId;

  try {
    const warehouseDeleted = await knex("warehouses").where({ id });
    if (warehouseDeleted.length === 0) {
      res.status(404).json("Warehouse not found");
    }
    await knex("warehouses").where({ id }).del();
    res.status(204).end()
  } catch (error) {
    console.error(error);
    res.status(500).json(`Unsuccessful: ${error}`);
  }
};

// Add a new warehouse
const addNew = async (req, res) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  if (
    // !warehouse_name ||
    // !address ||
    // !city ||
    // !country ||
    // !contact_name ||
    // !contact_position

    isEmpty(warehouse_name) ||
    isEmpty(address) ||
    isEmpty(city) ||
    isEmpty(country) ||
    isEmpty(contact_name) ||
    isEmpty(contact_position) ||
    isEmpty(contact_phone) ||
    isEmpty(contact_email)

  ) {
    return res.status(400).json({ message: "Please fill out all fields" });
  }

  if (!validator.isMobilePhone(contact_phone, "any", { strictMode: false })) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  if (!validator.isEmail(contact_email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    const [newWarehouse] = await knex("warehouses")
      .insert({
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
      })
      .returning("*");

    res.status(201).json(newWarehouse);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Unable to create new warehouse: ${error.message}` });
  }
};

// Get a single warehouse
const findWarehouse = async (req, res) => {
  try {
    const id = req.params.warehouseId;
    const foundWarehouse = await knex("warehouses")
      .where({ id })
      .select(
        "id",
        "warehouse_name",
        "address",
        "city",
        "country",
        "contact_name",
        "contact_position",
        "contact_phone",
        "contact_email"
      );

    if (foundWarehouse.length === 0) {
      return res.status(404).json(`Warehouse with ID ${id} not found`);
    }

    const warehouseData = foundWarehouse[0];
    res.status(200).json(warehouseData);
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};

// Update information for a warehouse
const update = async (req, res) => {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  const updateFields = {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  };

  try {
    const rowsUpdated = await knex("warehouses")
      .where({ id: req.params.warehouseId })
      .update(updateFields);

    if (rowsUpdated === 0) {
      return res.status(404).json({
        message: `warehouse with ID ${req.params.warehouseId} not found`,
      });
    }

    const updatedwarehouse = await knex("warehouses").where({
      id: req.params.warehouseId,
    });

    res.json(updatedwarehouse[0]);
  } catch (error) {
    res.status(500).json({
      message: `Unable to update warehouse with ID ${req.params.warehouseId}: ${error}`,
    });
  }
};

//Get inventory for any single warehouse
const getInventory = async (req, res) => {
  const id = req.params.warehouseId;
  try {
    const inventory = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .where("warehouse_id", id)
      .select(
        "inventories.id",
        "inventories.item_name",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );
    if (inventory.length === 0) {
      res.status(404).json("Warehouse Id not found");
    }
    res.status(200).json(inventory);
  } catch (error) {
    console.error(error);
  }
};

export { remove, addNew, findWarehouse, getWarehouses, update, getInventory };
