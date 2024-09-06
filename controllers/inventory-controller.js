import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const removeSingleInventory = async (req, res) => {
  const id = req.params.itemId;

  try {
    const inventoryItem = await knex("inventories")
      .where({ id });
    if (inventoryItem.length === 0) {
      res.status(404).json("Inventory item not found");
      return;
    }
    await knex('inventories')
      .where({ id })
      .del();
    res.status(200).json(inventoryItem);
  } catch (error) {
    console.error(error);
    res.status(500).json(`Bad request. ${error}`);
  }
};

const getSingleInventory = async (req,res) => {

  try {
      const id  = req.params.itemId

      const inventorySingle = await knex('inventories')
      .join('warehouses', 'inventories.warehouse_id', '=', 'warehouses.id')
      .where({ 'inventories.id':id })
      .select(
        'inventories.id',
        'warehouse_name',
        'item_name',
        'description',
        'category',
        'status',
        'quantity'
      )

      if (inventorySingle.length === 0) {
        res.status(404).json("Inventory item not found");
        return;
      }
      
  res.status(200).json(inventorySingle[0]) 
  } catch (error) {
      res.status(500).send(`Unable to retrieve data for inventory item with ID ${req.params.itemId}`)
  }
}

// Get all inventory
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

// Edit/update an existing resource in its entirety (PUT)
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

export { getAll, getSingleInventory, edit, removeSingleInventory};
