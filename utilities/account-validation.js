const utilities = require(".")
    const { body, validationResult } = require("express-validator")
    const accountModel = require("../models/account-model")
    const validate = {}

    /* *************************
     *  Registration Data Validation Rules
     * ************************ */
    validate.registrationRules = () => {
        return [
            // firstname is required and must be string
            body("account_firstname")
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 1 })
                .withMessage("Please provide a first name."),

            body("account_lastname")
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 2 })
                .withMessage("Please provide a last name."),

            body("account_email")
                .trim()
                .isEmail()
                .normalizeEmail()
                .withMessage("A valid email is required.")
                .custom(async (account_email) => {
                    const emailExists = await accountModel.checkExistingEmail(account_email)
                    if (emailExists){
                        throw new Error("Email exists. Please log in or use diffferent email")
                    }
                }),

            body("account_password")
                .trim()
                .notEmpty()
                .isStrongPassword({
                    minLength: 12,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                })
                .withMessage("Password does not meet requirements"),
        ]
    }

/* ********************************
 * Check data and return errors or continue to registration
 * ****************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav, 
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ********************************
 *  Validation rules for login
 * ****************************** */
validate.loginRules = () => {
    return [
        // firstname is required and must be string
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required."),

        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements"),
    ]
}

/* ********************************
 * Check data and return errors or continue to login
 * ****************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav, 
            account_email,
        })
        return
    }
    next()
}

/* *************************
*  Update Data Validation Rules
* ************************ */
validate.updateAccountRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),

        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),

        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email, { req }) => {
                console.dir(req.body)
                const emailExists = await accountModel.checkExistingEmail(account_email, req.body.old_email)
                if (emailExists){
                    throw new Error("Email exists. Please  use diffferent email")
                }
            }),
    ]
}

/* ********************************
 * Check data and return errors or continue to update
 * ****************************** */
validate.checkUpdateAccntData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav, 
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* *************************
*  Update Password Data Validation Rules
* ************************ */
validate.updatePasswordRules = () => {
    return [
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements"),
    ]
}

/* ********************************
 * Check data and return errors or continue to update password
 * ****************************** */
validate.checkUpdatePassData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Update",
            nav, 
        })
        return
    }
    next()
}

module.exports = validate