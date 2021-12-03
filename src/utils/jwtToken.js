//Create Token and saving in cookie

const sendToken = (user,redirect,res)=>{
    const token = user.getJWTToken();

    //Options for cookie
    const options = {
        expires: new Date(
            Date.now + process.env.COOKIE_EXPIRES * 24 *60*60*1000
        ),
        httpOnly: true,

    }
    res.cookie('token',token,options).redirect(redirect);
}

module.exports = sendToken;