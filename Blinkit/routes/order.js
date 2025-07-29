require('dotenv').config();
const express=require('express');
const router=express.Router();

const {orderModel}=require('../models/order');
const {paymentModel}=require('../models/payment');
const { cartModel } = require('../models/cart');

router.get("/:userid/:orderid/:paymentid/:signature",async(req,res)=>{
  try{
    let paymentDetails=await paymentModel.findOne({orderId : req.params.orderid});
    
    if(!paymentDetails)return res.status(400).send("sorry, payment not completed...");
    if(req.params.signature===paymentDetails.signature && req.params.paymentid===paymentDetails.paymentId ){
      
    let cart=await cartModel.findOne({user:req.params.userid});

      await orderModel.create({
        orderId:req.params.orderid,
        user: req.params.userid,
            products: cart.products ,
            totalPrice: req.params.totalPrice,
            address: req.params.address,
            status: "processing",
            payment: paymentDetails._id,
            
      });

    res.redirect(`/map/${req.params.orderid}`);
    }
    else{
      res.send("invalid payment");
    }

  }
  catch(err){
    res.status(500).send("payment not complete");
  }
});



router.post("/address/:orderid",async(req,res)=>{
  try{
    let order=await orderModel.findOne({orderId : req.params.orderid});
    if(!order)return res.status(400).send("sorry, this order does not exists...");
    if(!req.body.address)return res.status(400).send("you must provide address");
    order.address=req.body.address;
    order.save();
    res.redirect("/");
  }
  catch(err){
    res.status(500).send("payment not complete");
  }
})


module.exports=router;



