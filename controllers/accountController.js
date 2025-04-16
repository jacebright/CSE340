const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ******************************
 *  Deliver Login view
 * **************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ******************************
 *  Deliver Register view
 * **************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ******************************
 *  Process Registration
 * **************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password} = req.body;

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("error", 'Sorry, there was an error processing the registration')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title:"Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("error", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}

/* ******************************
 *  Process login request
 * **************************** */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            accountData.old_email = accountData.account_email
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
            } else {
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav, 
                errors: null,
                account_email,
            })
        }
} catch(error) {
    throw new Error('Access Forbidden')
}
}

/* ******************************
 *  Deliver Account view
 * **************************** */
async function buildAccount(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/account", {
        title: "Account",
        nav,
        errors: null,
    })
}

/* ******************************
 *  Deliver Account view
 * **************************** */
async function buildAccountUpdate(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
    })
}

/* ******************************
 *  Process Account Update
 * **************************** */
async function updateAccount(req, res) {
    let nav = await utilities.getNav();
    const { account_id, account_firstname, account_lastname, account_email } = req.body;

    const regResult = await accountModel.updateAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_id
    )

    if (regResult) {
        // update the cookie!!!!!!!!!
        const accountData = await accountModel.getAccountById(account_id)
        delete accountData.account_password

        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
          if (process.env.NODE_ENV === 'development') {
              res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
          } else {
              res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000 })
          }

        req.flash(
            "notice",
            `Congratulations, you\'re information has been updated, ${account_firstname}.`
        )
        res.status(201).render("account/account", {
            title:"Account",
            nav,
            errors: null,
        })
    } else {
        req.flash("error", "Sorry, the update failed.")
        res.status(501).render("account/update", {
            title: "Update",
            nav,
            account_firstname,
            account_lastname,
            account_email
        })
    }
}

/* ******************************
 *  Process password update
 * **************************** */
async function updatePassword(req, res) {
    let nav = await utilities.getNav();
    const { account_id, account_password} = req.body;

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("error", 'Sorry, there was an error processing the update')
        res.status(500).render("account/update", {
            title: "Update",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.updatePassword(
        hashedPassword,
        account_id
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'ve updated the password ${res.locals.accountData.account_firstname}.`
        )
        res.status(201).render("account/account", {
            title:"Update",
            nav,
            errors: null,
        })
    } else {
        req.flash("error", "Sorry, the update failed.")
        res.status(501).render("account/update", {
            title: "Update",
            nav,
        })
    }
}

/* ******************************
 *  Logout
 * **************************** */
async function logout(req, res) {
    res.clearCookie("jwt")
    delete res.locals.accountData;
    res.locals.loggedin = 0;
    req.flash("notice", "Logout successful.")
    res.redirect("/")}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, updateAccount, updatePassword, buildAccountUpdate, logout }