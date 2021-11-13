const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.static(path.join(__dirname,"public")));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
//Route Import
const user = require('./routes/userRoutes');

app.get('/',(req,res)=>{
    res.render('user/home/index');
});
app.use('/',user);


//Middleware for Errors
const errorMiddleware = require('./middlewares/error');
app.use(errorMiddleware);

module.exports = app;