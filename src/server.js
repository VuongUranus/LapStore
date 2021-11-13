const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

//Handling Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shuting down the server due toUncaught Exception');
    process.exit();
});


//Config
dotenv.config({path:"src/config/config.env"});

//connecting to database
connectDatabase();

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

//Unhandled Promise Rejection
process.on("unhandledRejection",err =>{
    console.log(`Error: ${err.message}`);
    console.log('Shuting down the server due to Unhandled Promise Rejection');

    server.close();
});