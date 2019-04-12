const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user.model');
module.exports = (passport)=>{
    let config = {};
    config.secretOrKey = process.env.JWT_SECRET || 'thisistopsecret';
    config.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
    passport.use(new jwtStrategy(config,async (jwtPayload,done)=>{
        try{
            console.log(jwtPayload);
            const user =await User.findById(jwtPayload._id);
            if(user){
                return done(null,user);
            }else{
                return done(null,false);
            }
        }catch(e){
            done(e,false)
        }
    }))
}