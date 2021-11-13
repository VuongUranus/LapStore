const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser, 
    logout,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser
 } = require('../controllers/userController');

const { isAuthenticationUser, authorizeRoles } = require('../middlewares/auth');

router.route('/register').post(registerUser);

router.route('/login')
.get((req,res)=>{

    const {token} = req.cookies;

    if(token){
        return res.redirect('/');
    }
    
    res.render("user/authenticate/login.ejs",{message:req.flash('loginMessage')});

})
.post(loginUser);

router.route('/logout').get(logout);

router.route('/me')
.get(isAuthenticationUser,getUserDetails)

router.route("/password/update")
.put(isAuthenticationUser,updatePassword)

router.route('/me/update')
.put(isAuthenticationUser,updateProfile)

router.route('/admin/users')
.get(isAuthenticationUser,authorizeRoles("admin"),getAllUser);

router.route('/admin/user/:id')
.get(isAuthenticationUser,authorizeRoles("admin"),getSingleUser)
.put(isAuthenticationUser,authorizeRoles("admin"),updateUser)
.delete(isAuthenticationUser,authorizeRoles("admin"),deleteUser);

module.exports = router;