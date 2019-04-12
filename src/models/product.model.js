const mongoose = require('mongoose');
const {Schema}=mongoose;
const ProductSchema = Schema({
    amount: {type:Number,required:true},
    description: {type:String},
    created: {type:Date,required:true},
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

const Product =mongoose.model('Product',ProductSchema) ;
module.exports=Product;