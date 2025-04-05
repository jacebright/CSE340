const invModel = require("../models/inventory-model")
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
    details = '<section class="detailPage"><div class="showroom"><img src="'
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

/* ************************
 * Constructs the options for classification for the new inventory form
 ************************** */
Util.getClass = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = ""
  data.rows.forEach((row) => {
    list += `<option value="${row.classification_id}">${row.classification_name}</option>`
  })
  return list
}

/* *****************************
 *  Middleware For Handling Errors
 *  Wrap other function in this for 
 *  General Error Handling
 * **************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util