const Product = require('../models/product.model');
const productController={}
productController.create = async (req,res,next)=>{
   const {amount,description,created}= req.body;
   const newProduct = new Product({
       amount,
       description,
       created,
       owner:req.user
   });
   try{
    // const fakeerr = new Error('failed to save');
    // return next(fakeerr); 
    const product=await newProduct.save();
    return res.send({success:true,product})
   }catch(e){
       next(e);
   }
}
productController.get = async(req,res,next)=>{
    const {user}=req;
    const now = new Date();
    const month = parseInt(req.params.month);
    if(month && month>=0 && month <=11) now.setMonth(month);
    if(month===0) now.setMonth(0);
    //0-11
    //now.setMonth(0);
    const firstDay = new Date(now.getFullYear(),now.getMonth(),1);
    const lastDay = new Date(now.getFullYear(),now.getMonth()+1,0)
    const query ={
        owner:user._id,
        created:{
            $gte:firstDay,
            $lt:lastDay
        }
    }
    try{
        const result=await Product.find(query).sort({created:'desc'});
        return res.send({product:result})
    }catch(e){
        next(e);
    }
}
productController.destroy = async(req,res,next)=>{
    const product_id = req.params.product_id;
    try{
        await Product.deleteOne({_id:product_id});
        res.send({success:true})
    }catch(e){
        next(e);
    }
}
productController.update = async(req,res,next)=>{
    const product_id = req.params.product_id;
    const {amount,description,created}=req.body;
    try{
        const check = await Product.findOne({_id:product_id});
        if(!check.owner.equals(req.user._id)){
            const err = new Error('this product doesnot belong to you!');
            err.status=401;
            throw err;
        }
        const product = await Product.update({_id:product_id}, {amount,description,created})
        return res.send({success:true,product})
    }catch(e){
        next(e);
    }
}
module.exports=productController;