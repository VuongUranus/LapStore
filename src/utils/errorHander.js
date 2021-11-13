class ErrorHander extends Error{
    constructor(message,redirect,flashName){
        super(message);
        this.redirect = redirect;
        this.flashName = flashName;
        Error.captureStackTrace(this,this.constructor);
    }
}

module.exports = ErrorHander