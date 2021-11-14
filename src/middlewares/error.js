const ErrorHander = require('../utils/errorhander');

module.exports = (err,req,res,next) => {
    err.redirect = err.redirect || "/";
    err.message = err.message || "Internal Server Error";
    err.flashName = err.flashName || "homeMessage";

    console.log(err.name);
    req.flash(err.flashName,err.message);
    res.redirect(err.redirect);
}