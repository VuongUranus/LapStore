module.exports = (error) =>{
        //Wrong Mongodb Id error
        if(error.name === "CastError"){
            const message = `Resource not found. Invalid: ${error.path}`;
            return message;
        }
    
        //Mongoose dupicate key error
        if(error.code === 11000){
            const message = `Duplicate ${Object.keys(error.keyValue)} Entered`;
            return message;
        }
    
        if (error.name === "JsonWebTokenError") {
            const message = `Json Web Token is invalid, Try again `;
            return message;
        }

        return error.message;
}