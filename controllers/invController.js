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
    let title = ""
    if (data[0] == undefined)  {
        title = "No vehicles to display"
    } else {
        const className = data[0].classification_name
        title = className + " vehicles"
    }
    res.render("./inventory/classification", {
        title: title,
        nav,
        grid,
        errors: null
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
        errors: null
    })
}

/* ****************************************
 *  Build management view
 * ************************************** */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null
    })
}

/* ****************************************
 *  Build add new classification view
 * ************************************** */
invCont.buildNewClass = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "New Classification",
        nav,
        errors: null
    })
}

/* ****************************************
 *  Build add new inventory view
 * ************************************** */
invCont.buildNewInv = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
        title: "New Inventory",
        nav,
        classifications: await utilities.getClass(),
        errors: null
    })
}

/* ******************************
 *  Process New Classification
 * **************************** */
invCont.addNewClassification = async function (req, res) {
    let nav = await utilities.getNav();
    const { classification_name } = req.body;

    const classResult = await invModel.addNewClassification(
        classification_name
    )

    if (classResult) {
        req.flash(
            "notice",
            `Congratulations, you\'ve added ${classification_name}.`
        )
        res.status(201).render("inventory/add-classification", {
            title:"New Classification",
            nav: await utilities.getNav(),
            errors: null,
        })
    } else {
        req.flash("error", "Sorry, adding the new classification failed.")
        res.status(501).render("inventory/add-classification", {
            title: "New Classification",
            nav,
        })
    }
}

/* ******************************
 *  Process New Inventory
 * **************************** */
invCont.addNewInventory = async function (req, res) {
    let nav = await utilities.getNav();
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

    const invResult = await invModel.addNewInventory(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )

    if (invResult) {
        req.flash(
            "notice",
            `Congratulations, you\'ve added the ${inv_year} ${inv_make} ${inv_model}.`
        )
        res.status(201).render("inventory/add-inventory", {
            title:"New Inventory",
            nav: nav,
            classifications: await utilities.getClass(),
            errors: null,
        })
    } else {
        req.flash("error", "Sorry, adding the new classification failed.")
        res.status(501).render("inventory/add-inventory", {
            title: "New Inventory",
            nav,
            classifications: await utilities.getClass(),
        })
    }
}

module.exports = invCont