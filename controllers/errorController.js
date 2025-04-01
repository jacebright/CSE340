const utilities = require("../utilities/")

const errorController = {}

throwError = function(err) {
    return new Error(`Status: ${err} - AKA: You've got a bad alternator`)
}


errorController.buildError = async function (req, res, next) {
    const status = req.params.status
    const error = throwError(status)
    let nav = await utilities.getNav()
    res.render("./error", {
        title: status,
        nav,
        error,
    })
}

module.exports = errorController;