const utilities = require(".")
    const { body, validationResult } = require("express-validator")
    const innModel = require("../models/inventory-model")
    const validate = {}

/* ********************************
 *  Validation rules for Adding Classification
 * ****************************** */
validate.classificationRules = () => {
    return [
        // classification name is required and must be only alphabetical characters
        body("classification_name")
            .escape()
            .notEmpty()
            .withMessage("Only alphabetical characters allowed.")
            .matches(/^[a-zA-Z]+$/),
    ]
}

/* ********************************
 * Check data and return errors or continue to add classification
 * ****************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav, 
            classification_name,
        })
        return
    }
    next()
}

/* ********************************
 *  Validation rules for Adding Classification
 * ****************************** */
validate.inventoryRules = () => {
    return [
        // classification id is required
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Classification is required")
            .isInt(),

        // inv_make is required and only contains alphabet characters
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Make value is missing")
            .matches(/^[a-zA-Z]+$/)
            .withMessage("Only alphabetical characters allowed."),

        // inv_model is required and only contains alphabet characters
        body("inv_model")
            .escape()
            .notEmpty()
            .withMessage("Model value is missing"),

        // inv_year is required and contains exactly 4 numbers
        body("inv_year")
            .escape()
            .notEmpty()
            .withMessage("Year value is missing")
            .isInt({min:1900, max:2030})
            .withMessage("A four digit year is required"),

        // inv_description is required
        body("inv_description")
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Description is missing."),

        // inv_image is required
        body("inv_image")
            .escape()
            .notEmpty()
            .withMessage("Image URL is required."),

        // inv_thumbnail is required
        body("inv_thumbnail")
            .escape()
            .notEmpty()
            .withMessage("Image URL is required."),

        // inv_price is required and must be a number
        body("inv_price")
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Only numeric characters allowed."),

        // inv_miles is required and must be a number
        body("inv_miles")
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("Only numeric characters allowed."),
            
        // inv_color is required and only contains alphabet characters
        body("inv_color")
            .escape()
            .notEmpty()
            .withMessage("Only alphabetical characters allowed.")
            .matches(/^[a-zA-Z]+$/),
    ]
}

/* ********************************
 * Check data and return errors or continue to add inventory
 * ****************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav: nav, 
            classifications: await utilities.getClass(classification_id),
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color, 
            classification_id,
        })
        return
    }
    next()
}

/* ********************************
 * Check data and return errors or continue to edit inventory
 * ****************************** */
validate.checkEditData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const itemName = `${inv_make} ${inv_model}`
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit " + itemName,
            nav: nav, 
            classifications: await utilities.getClass(classification_id),
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color, 
            classification_id,
            inv_id,
        })
        return
    }
    next()
}


module.exports = validate