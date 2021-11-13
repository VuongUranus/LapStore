const ErrorHander = require('../utils/errorhander');

module.exports = (err,req,res,next) => {
    err.redirect = err.redirect || "/";
    err.message = err.message || "Internal Server Error";
    err.flashName = err.flashName || "homeMessage";

    //Wrong Mongodb Id error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHander(message);
    }

    //Mongoose dupicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHander(message);
    }
    console.log(err.message);
    req.flash(err.flashName,err.message);
    res.redirect(err.redirect);
}