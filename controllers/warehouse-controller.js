import initKnex from "knex";
import configuration from "../knexfile.js";
import validator from "validator";


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


const addNew = async (req, res) => {
    const { warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email } = req.body;


    if (
        !warehouse_name || 
        !address || 
        !city || 
        !country || 
        !contact_name || 
        !contact_position
    ) {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }

    if (!validator.isMobilePhone(contact_phone, 'any', { strictMode: false })) {
        return res.status(400).json({ message: 'Invalid phone number' });
    }

    if (!validator.isEmail(contact_email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    try {
        const [newWarehouse] = await knex('warehouses')
            .insert({
                warehouse_name,
                address,
                city,
                country,
                contact_name,
                contact_position,
                contact_phone,
                contact_email
            })
            .returning('*'); 

        res.status(201).json(newWarehouse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Unable to create new warehouse: ${error.message}` });
    }
};


const update = async (req, res) => {
    const { warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email } = req.body;

    const updateFields = {
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email
    };

  try {
    const rowsUpdated = await knex("warehouses")
      .where({ id: req.params.id })
      .update(updateFields);

    if (rowsUpdated === 0) {
      return res.status(404).json({
        message: `warehouse with ID ${req.params.id} not found` 
      });
    }

    const updatedwarehouse = await knex("warehouses")
      .where({
        id: req.params.id,
      });
    
    res.json(updatedwarehouse[0]);
  } catch (error) {
    res.status(500).json({
      message: `Unable to update warehouse with ID ${req.params.id}: ${error}` 
    });
  }
};





export { remove, addNew, update };
