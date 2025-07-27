
const express=require('express');
const router=express.Router();
const {productModel,validateProduct}=require('../models/product');
const {categoryModel,validateCategory}=require('../models/category');
const {cartModel,validateCart}=require('../models/cart');
const upload=require('../config/multer_config');
const {validateAdmin,userIsLoggedIn}=require('../middleware/admin');


router.get('/', userIsLoggedIn, async(req,res)=>{
  let somethingInCart=false;
  const resultArray=await productModel.aggregate([
    {
      $group:{
        _id:'$category',
        products:{$push:"$$ROOT"},
      }
    },
    {
      $project:{
        _id:0,
        category:"$_id",
        products:{$slice: ["$products",10]},
      }
    }
  ])
  
  let cart=await cartModel.findOne({user:req.session.passport.user});
  if(cart && cart.products.length > 0)somethingInCart=true;
  const rnproducts=await productModel.aggregate([
    {$sample: { size:3}}
  ]);

  

  // convert array to object
  const resultObject=resultArray.reduce((acc,item)=>{
  acc[item.category]=item.products;
  return acc;
  },{});
  res.render('index',
    {
      products: resultObject,
      rnproducts,
      somethingInCart,
      cartCount: cart ? cart.products.length : 0
});
});





router.get('/delete/:id', validateAdmin, async(req,res)=>{
  try{
    if(req.user.admin){
      await productModel.findOneAndDelete({_id:req.params.id});
      return res.redirect('/admin/products');
    }
    else{
      res.status(400).send("You are not allowed to delete this product.");
    }
  }
  catch(err){
  res.status(500).send("Internal Server Error.");
  }
});


router.post('/delete', validateAdmin, async(req,res)=>{
  try{
    if(req.user.admin){
      await productModel.findOneAndDelete({_id:req.body.product_id});
      return res.redirect("back");
    }
    else{
      res.status(400).send("You are not allowed to delete this product.");
    }
  }
  catch(err){
  res.status(500).send("Internal Server Error.");
  }
});



router.post('/create',upload.single("image") , async(req,res)=>{
  try{

    const {name,price,category,stock,description,image}=req.body;

    let {error}=validateProduct({
      name,
      price,
      category,
      stock,
      description,
    });
   if(error) res.status(400).send(error.message);
   
   const isCategory=await categoryModel.findOne({name:category});
   if(!isCategory){
    await categoryModel.create({name:category});
   }

   await productModel.create({
    name,
    price,
    category,
    stock,
    description,
    image: req.file ? req.file.buffer : null,
    imageType: req.file ? req.file.mimetype : null,
   });
   res.redirect('/admin/dashboard');
  }
  catch(err){
    console.error(err);
    res.status(500).send('Product creation failed');
  }
});





module.exports=router;


