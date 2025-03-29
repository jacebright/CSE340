const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorController")

// Route to build invenotry by classification view
router.get("/:status", errorController.buildError);

module.exports = router;