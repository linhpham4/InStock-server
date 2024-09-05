import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const getSingleInventory = async (req,res) => {
    const id  = req.params.itemId
    console.log(id)

    try {
        const inventorySingle = await knex('inventories')
        .select(
            'id',
            'warehouse_name',
            'item_name',
            'description',
            'category',
            'status',
            'quantity'
        )
        .where({id:id})

    res.status(200).json(inventorySingle) 
    } catch (error) {
        res.status(500).send(`Unable to retrieve data for inventory item with ID ${req.params.itemId}`)
    }
}

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



export { getAll, getSingleInventory};
