
const express=require('express');
const router=express.Router();
const {productModel,validateProduct}=require('../models/product');
const {categoryModel,validateCategory}=require('../models/category');
const {validateAdmin}=require('../middleware/admin');


router.post('/create',validateAdmin, async (req,res)=>{
  try{
  const category=await categoryModel.create({
    name:req.body.category
  });
  res.redirect("back");
  }
  catch(err){
  res.status(500).send("Internal Server Error.");
  }
})

module.exports=router;

