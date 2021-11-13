const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const morgan = require('morgan');

const app = express();

app.use(express.static(path.join(__dirname,"public")));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: '123'}));
app.use(flash());

//Route Import
const user = require('./routes/userRoutes');

app.get('/',(req,res)=>{
    res.render('user/home/index',req.flash('homeMessage'));
});
app.use('/',user);
app.post('/checkLogin',(req,res)=>{
    if(req.cookies.token){
        return res.send(true);
    }
    return res.send(false);
});


//Middleware for Errors
const errorMiddleware = require('./middlewares/error');
app.use(errorMiddleware);

module.exports = app;