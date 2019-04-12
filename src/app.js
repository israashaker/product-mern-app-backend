const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const v1 = require('./routes/v1');
const passport = require('passport');
const cors = require('cors');
const app =express();
//--------------- DB config -------------------
mongoose.connect(process.env.MONGO_DB_URL || 'mongodb://localhost:27017/mydbproducts',{
    useNewUrlParser:true,
    useCreateIndex:true
});
mongoose.connection.on('connected',()=>{
    console.log('connected to the database');
})
mongoose.connection.on('error',(err)=>{
    console.log(`Failed to connect to the database ${err}`);
})
//--------------- Middlewares -------------------
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
//--------------- Routes -------------------
app.use('/api',v1)
//--------------- Errors -------------------
app.use((req,res,next)=>{ //404 not found
    //res.status(404).send({message:'not found'})
    var err = new Error('not found');
    err.status = 404;
    next(err);
})
app.use((err,req,res,next)=>{ //global error handler
   
    const status = err.status || 500; //internal server error
    const error = err.message || 'error processing your request';
    res.status(status).send({error})
})
module.exports = app;