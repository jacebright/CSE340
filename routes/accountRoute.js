// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require('../utilities/index')
const accntController = require("../controllers/accountController")
const errorController = require("../controllers/errorController")
const regValidate = require("../utilities/account-validation")


// Route to login page
router.get("/login", utilities.handleErrors(accntController.buildLogin));

router.get("/register", utilities.handleErrors(accntController.buildRegister));

router.post('/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accntController.registerAccount
    ))

router.get("/error/:status", errorController.buildError);

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accntController.accountLogin)
)

router.get("/", utilities.checkLogin, utilities.handleErrors(accntController.buildAccount));

// Build the account management page
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accntController.buildAccountUpdate));

// Process the update requests
// For the Password Update
router.post('/update-pass',
    regValidate.updatePasswordRules(),
    regValidate.checkUpdatePassData,
    utilities.handleErrors(accntController.updatePassword))

// For the account update
router.post('/update',
    regValidate.updateAccountRules(),
    regValidate.checkUpdateAccntData,
    utilities.handleErrors(accntController.updateAccount))

router.get('/logout', utilities.handleErrors(accntController.logout))

module.exports = router;