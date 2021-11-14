const User = require('../models/userModel');
const ErrorHander = require('../utils/errorHander');
const sendToken = require('../utils/jwtToken');
const typeErrors = require('../utils/typeErrors');

//Register a User
exports.registerUser =  async (req,res,next)=>{
    try{
        const {name,email,password} = req.body;

        const user = await User.create({
            name,email,password
        });
        
        sendToken(user,'/',res);
    }catch(error){
        const message = typeErrors(error);
        return next(new ErrorHander(message,"/login",'loginMessage'));
    }
};

//Login
exports.loginUser = async(req,res,next)=>{
    try{

        const {email,password} = req.body;

        //checking if user has given password and email both
        if(!email || !password){
            return next(new ErrorHander("Please Enter Email & Password","/login","loginMessage"));
        }

        const user = await User.findOne({email}).select("+password");

        if(!user){
            return next(new ErrorHander("Invalid email or password","/login","loginMessage"));
        }

        const isPasswordMatched = await user.comparePassword(password);

        if(!isPasswordMatched){
            return next(new ErrorHander("Invalid email or password","/login","loginMessage"));
        }

        sendToken(user,'/',res);
    }catch(error){
        const message = typeErrors(error);
        return next(new ErrorHander(message,"/login","loginMessage"));
    }

};

//Logout User
exports.logout = async (req,res,next)=>{

    try {
     
        res.cookie("token",null,{
            expires: new Date(Date.now()),
            httpOnly: true,
        });
    
        res.redirect('/login'); 
    
    } catch (error) {
        next(new ErrorHander(error.message));
    }
};

// GET USER DETAIL
exports.getUserDetails = async(req,res,next)=>{

    try {
        const user = await User.findById(req.user.id);

        const message = req.flash('profileMessage');
        res.render("user/user/profile",{message:message,user});
    } catch (error) {
        const message = typeErrors(error);
        next(new ErrorHander(message,'/me','profileMessage'));
    }


};

//Update User password
exports.updatePassword = async (req,res,next)=>{

    try {
        
        const user = await User.findById(req.user.id).select("+password");

        const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
        
        if(!isPasswordMatched){
            return next(new ErrorHander("Old password is incorrect","/password/update","updatePasswordMessage"));
        }

        const compareNewPassword = await user.comparePassword(req.body.newPassword);
        if(compareNewPassword){
            return next(new ErrorHander("You typed the old password please make a new one",'/password/update','updatePasswordMessage'));
        }
    
        if(req.body.newPassword !== req.body.confirmPassword){
            return next(new ErrorHander("Password does not match","/password/update","updatePasswordMessage"));
        }
    
        user.password = req.body.newPassword;
    
        await user.save();

        req.flash('profileMessage','Update Password Successfully.');
    
        sendToken(user,'/me',res);

    } catch (error) {
        const message = typeErrors(error);
        next(new ErrorHander(message,'/password/update','updatePasswordMessage'));
    }

};

//Update User profile
exports.updateProfile = async(req,res,next)=>{

    try {

        const userCheck = await User.findById(req.user);

        if(req.body.name === userCheck.name && req.body.email === userCheck.email){
            return next(new ErrorHander('The new infomation can\'t be the same with the old one','/me','profileMessage'));
        }

        const newUserData = {
            name: req.body.name,
            email: req.body.email,
        }
    
        const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
            new:true,
            runValidators:true,
            useFindAndModify: false,
        });

        req.flash('profileMessage','Update Successfully!');
        res.redirect('/me');
        
    } catch (error) {
        const message = typeErrors(error);
        next(new ErrorHander(message,'/me','profileMessage'));
    }

};

//Get All User (admin)
exports.getAllUser = async (req,res,next)=>{

    try {
        
        const users = await User.find();

        res.status(200).json({
            success:true,
            users,
        });

    } catch (error) {
        const message = typeErrors(error);
        next(new ErrorHander(message));
    }

};

//Get single user (admin)
exports.getSingleUser =  async (req,res,next)=>{

    try {
     
        const user = await User.findById(req.params.id);

        if(!user){
            return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`));
        }
    
        res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        const message = typeErrors(error);
        next(new ErrorHander(message));
    }

};

//Update User Role --Admin
exports.updateUser = async(req,res,next)=>{

    try {
     
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

    } catch (error) {
        const message = typeErrors(error);
        next(new ErrorHander(message));
    }

};

//Delete User
exports.deleteUser = async (req,res,next)=>{

    try {
     
        const user = await User.findById(req.params.id);

        if(!user){
            return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`));
        }
    
        await user.remove();
    
        res.status(200).json({
            success: true,
            message: "User deleted successfully!"
        })

    } catch (error) {
        const message = typeErrors(error);
        next(new ErrorHander(message));
    }

};
