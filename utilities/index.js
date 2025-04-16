const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* *************************
 *  Build the classification view HTML
 * ************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li class="inv-vehicle">'
            grid += '<a href="../../inv/detail/'+vehicle.inv_id
            + '"title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
            +' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details" class="button-link">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* *************************
 *  Build the detail view HTML
 * ************************ */
Util.buildDetails = async function(data){
  let details
  if(data.length > 0){
    details = '<div class="detailPage"><div class="showroom"><img src="'
    +data[0].inv_image+'" alt="'+data[0].inv_year 
    + ' ' + data[0].inv_make + ' ' + data[0].inv_model+'"></div>'
    details+= '<div class="carDetails">'
    details+= '<p class="description">'+data[0].inv_description+'</p>'
    details+= '<ul><li><strong>Price:</strong>  $'
    +new Intl.NumberFormat('en-US').format(data[0].inv_price)
    +'</li><li><strong>Mileage:</strong>  '
    +new Intl.NumberFormat('en-US').format(data[0].inv_miles)
    +'</li><li><strong>Color:</strong>  '
    +data[0].inv_color+'</li></ul></div></div>'
  } else {
      details += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return details
}

/* *************************
 *  Build the comments view for the detail page
 * ************************ */
Util.buildComments = async function(data){
  let comments
  if(data.length > 0){
    comments = '<div class="comment_section"><h3>Comments</h3>'
    data.forEach(comment => {
      comments += '<div class="comment">'
      comments += `<p>${comment.comment_inv}</p></div>`
    });
    comments += '</div>'
  } else {
      comments
  }
  return comments
}

/* ************************
 * Constructs the options for classification for the new inventory form
 ************************** */
Util.getClass = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let list = ""
  data.rows.forEach((row) => {
    list += `<option value="${row.classification_id}"`
    if (
      row.classification_id == classification_id
    ) {
      list += "selected";
    }
    list += `>${row.classification_name}</option>`
  })
  return list
}

/* *****************************
 *  Middleware For Handling Errors
 *  Wrap other function in this for 
 *  General Error Handling
 * **************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* *****************************
 *  Middleware to check token validity
 * **************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if(err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else{
    next()
  }
}

/* *****************************
 *  Middleware to check if the user is authorized as an employee or admin
 * **************************** */
Util.checkIfAuthorized = (req, res, next) => {
  if (res.locals.loggedin == "1" && (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin")) {
    next()
  } else {
    
    res.redirect("/account/login")
    req.flash("notice", "You are not authorized to view this page")
  }
}

/* *****************************
 *  Check Login
 * **************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin){
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* *****************************
 *  updateCookie
 * **************************** */
Util.updateCookie = (req, res, accountData) => {
  console.log("cookie update began")
  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
  if (process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
  } else {
      res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000 })
  }
}

module.exports = Util