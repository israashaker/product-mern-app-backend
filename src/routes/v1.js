const express = require('express');
const router =express.Router();
const passport = require('passport');
const userController= require('../controllers/users.controller');
const productController = require('../controllers/product.controller')
//Auth and Sign Up
router.post('/register',userController.register);
router.post('/auth',userController.login);
//customize and protect routes
router.all('*',(req,res,next)=>{
    passport.authenticate('jwt',{session:false},(err,user)=>{
        if(err || !user){
            const error = new Error('you are not authorized to access this area');
            error.status=401;
            throw error;
        }
        req.user = user;
        return next();
    })(req,res,next);
})
router.get('/test',(req,res,next)=>{
    return res.send({message:'hi you are authenticated',user:req.user})
});
//----------------protected routes-------------
router.get('/me',userController.me);
router.get('/product/:month?',productController.get);
router.post('/product',productController.create);
router.put('/product/:product_id',productController.update);
router.delete('/product/:product_id',productController.destroy);
module.exports=router;
