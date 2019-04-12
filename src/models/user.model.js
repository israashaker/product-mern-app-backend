const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const {Schema}=mongoose;
const userSchema = Schema({
    name: {type:String},
    email: {type:String,required:true,index:true,unique:true},
    password: {type:String,required:true},
    joined: {type:Date,default:new Date()}
})
userSchema.pre('save',async function (next){
    //check new account or password is modified
    if(!this.isModified('password')){
        return next();
    }
    //encrpt password
    try{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password,salt);
        this.password = hash;
        next();
    }catch(e){
        return next(e);
    }
})
userSchema.methods.isPasswordMatch = function(password,hashed,callback){
    bcrypt.compare(password,hashed,(err,success)=>{
        if(err){
            return callback(err);
        }
        callback(null,success)
    });
}
userSchema.methods.toJSON =function(){
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
}
const User =mongoose.model('User',userSchema) ;
module.exports=User;