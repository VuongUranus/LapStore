const User = require('../models/userModel');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHander = require('../utils/errorHander');
const sendToken = require('../utils/jwtToken');

//Register a User
exports.registerUser = catchAsyncErrors( async (req,res,next)=>{

    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password
    });

    sendToken(user,201,res);

});

//Login
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{

    const {email,password} = req.body;

    //checking if user has given password and email both
    if(!email || !password){
        return next(new ErrorHander("Please Enter Email & Password",401));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHander("Invalid email or password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHander("Invalid email or password",401));
    }

    sendToken(user,200,res);

});

//Logout User
exports.logout = catchAsyncErrors(async (req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    })
});

// GET USER DETAIL
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });

});

//Update User password
exports.updatePassword = catchAsyncErrors( async (req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    
    if(!isPasswordMatched){
        return next(new ErrorHander("Old password is incorrect",400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHander("Password does not match",400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);


});

//Update User profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success:true,
        user
    });

});

//Get All User (admin)
exports.getAllUser = catchAsyncErrors(async (req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    });
});

//Get single user (admin)
exports.getSingleUser = catchAsyncErrors( async (req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user,
    });

});

//Update User Role --Admin
exports.updateUser = catchAsyncErrors(async(req,res,next)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success:true,
        user
    });

});

//Delete User
exports.deleteUser = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`));
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User deleted successfully!"
    })

});
