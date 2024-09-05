import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

<<<<<<< HEAD
const getSingleInventory = async (req, res) => {
    const id = req.params.inventoryId

    try {
        const data = await knex("inventory").where({ id: id });
        res.status(200).json(data);
    } catch (error) {
        res.status(404).send({
        message: `User with ID ${req.params.id} not found` 
          });
    }


}

export {getSingleInventory};


// const getWarehouses = async (_req, res) => {
//     try {
//         const data = await knex.select('id','warehouse_name', 'address','city', 'country', 'contact_name', 'contact_position', 'contact_phone', 'contact_email').from('warehouses')
//         res.status(200).json(data);
//     } catch (error) {
//         res.status(400).send(`Error retrieving warehouses: ${error}`)
//     }
// }
=======
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



export { getAll};
>>>>>>> develop
