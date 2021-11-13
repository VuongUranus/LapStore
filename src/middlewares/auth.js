const ErrorHander = require("../utils/errorhander");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAuthenticationUser = async(req,res,next)=>{

    try {
        const {token} = req.cookies;
        if(!token){
            return next(new ErrorHander("Please login to access this resoure","/login","loginMessage"));
        }
    
        const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    
        req.user = await User.findById(decodedData.id);
    
        next();

    } catch (error) {
        next(new ErrorHander(error.message,"/login","/loginMessage"));
    }

};

exports.authorizeRoles = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHander(`Role: ${req.user.role} is not allowed to access this resouce`));
        }
        next();
    }
}