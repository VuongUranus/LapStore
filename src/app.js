//Require
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const morgan = require('morgan');
const dotenv = require('dotenv');
const methodOverride = require('method-override');

//Config evironment variable
dotenv.config({path:"src/config/config.env"});

const app = express();

//Config app variable
app.use(express.static(path.join(__dirname,"public")));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(session({secret: process.env.SECRET_SESSION}));
app.use(flash());

//Route Import
const user = require('./routes/userRoutes');
const product = require('./routes/productRoutes');
const order = require('./routes/orderRoutes');
const brand = require('./routes/brandRoutes');

app.post('/checkLogin',(req,res)=>{
    if(req.cookies.token){
        return res.send(true);
    }
    return res.send(false);
});

app.get('/admin',(req,res)=>{
    res.redirect('/admin/products');
})

app.use('/',user);
app.use('/',product);
app.use('/',order);
app.use('/',brand);

//Middleware for Errors
const errorMiddleware = require('./middlewares/error');
app.use(errorMiddleware);

module.exports = app;