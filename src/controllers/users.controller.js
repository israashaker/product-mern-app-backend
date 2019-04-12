const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const userController={}
userController.register = async (req,res,next)=>{
    const {name,email,password,joined}= req.body;
    const newUser = new User({
        name,
        email,
        password,
        joined
    });
    try{
        const user = await newUser.save();
        return res.send({user})
    }catch(e){
        next(e);
    }
}
userController.login = async (req,res,next)=>{
    //password, username in request
    const {email,password} = req.body;
    try{
        //check password,username is ok
        const user = await User.findOne({email});
        if(!user){
            const err = new Error(`the email ${email} was not found`);
            err.status = 401;
            next(err);
        }
        user.isPasswordMatch(password,user.password,(err,matched)=>{
            if(matched){
                //if credintials ok, create JWT and return it
                //return res.send({message:'you can login'});
                //secret
                //expiration
                const secret = process.env.JWT_SECRET || 'thisistopsecret';
                const expire = process.env.JWT_EXPIRATION || 3600;
                const token = jwt.sign({_id:user._id},secret,{expiresIn:expire});
                return res.send({token});
            }
            res.status(401).send({error:'invalid username/password'})
        })
    }catch(e){
        next(e)
    }
    
}
userController.me =(req,res,next)=>{
    const {user} = req;
    res.send({user});
}
module.exports=userController;