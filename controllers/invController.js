const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ****************************************
 *  Build inventory by classification view
 * ************************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ****************************************
 *  Build vehicle view
 * ************************************** */
invCont.buildByVehicleId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getVehicleByInventoryId(inv_id)
    const detail = await utilities.buildDetails(data)
    let nav = await utilities.getNav()
    const vechicleName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
    res.render("./inventory/detail", {
        title: vechicleName,
        nav,
        detail,
    })
}

module.exports = invCont