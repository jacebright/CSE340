// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/index")
const invValidate = require("../utilities/inventory-validation")

// Route to build invenotry by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle by inv_id view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByVehicleId));

// Route to build the management views
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/new/Class", utilities.handleErrors(invController.buildNewClass));
router.get("/new/Inv", utilities.handleErrors(invController.buildNewInv));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// edit inventory routes
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEdit))
router.post("/edit/",
    invValidate.inventoryRules(),
    invValidate.checkEditData,
     utilities.handleErrors(invController.editInventory))

// Post form data
router.post('/new/Class',
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification
    ))

// Post form data
router.post('/new/Inv',
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addNewInventory
    ))


router.get("/error/:status", errorController.buildError);

module.exports = router;