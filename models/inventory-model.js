const pool = require("../database/");

/* ****************************
 *  Get all classification data
 * *************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* *****************************
 *  Get all inventory items and classification_name by classification_id
 * **************************** */
async function getInventoryByClassificationId(classification_id) {
    try{
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

/* *****************************
 *  Get vehicles items by inv_id
 * **************************** */
async function getVehicleByInventoryId(inv_id) {
    try{
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i WHERE i.inv_id = $1`,
            [inv_id]
        )
        console.log("I have queried")
        return data.rows
    } catch (error) {
        console.error("getVehicleByInventoryId error " + error)
    }
}

/* **********************************
* Add new classification
 * ******************************** */
async function addNewClassification(classification_name){
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
        return await pool.query(sql, [classification_name]);
    } catch (error) {
        return error.message;
    }
}

/* **********************************
* Add new inventory item
 * ******************************** */
async function addNewInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
    try {
        const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
        return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);
    } catch (error) {
        return error.message;
    }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleByInventoryId, addNewClassification, addNewInventory}