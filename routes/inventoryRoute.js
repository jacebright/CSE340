// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")

// Route to build invenotry by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle by inv_id view
router.get("/detail/:invId", invController.buildByVehicleId);

router.get("/error/:status", errorController.buildError);

module.exports = router;