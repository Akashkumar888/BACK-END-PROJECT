require('dotenv').config();

const userModel=require('../models/user.model');
const productModel=require('../models/product.model');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const blacklistModel=require('../models/blacklist.model');
const paymentModel=require('../models/payment.model');
const orderModel=require("../models/order.model");


const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



module.exports.signup=async(req,res,next)=>{
  try{
   const {username,email,password,role}=req.body;
   if(!username || !email|| !password){
     return res.status(400).json({message:"All field are required "});
   }
   const isUserAlreadyExists=await userModel.findOne({email});
   if(isUserAlreadyExists){
    return res.status(400).json({message:"User already exists"});
   }
   // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);


   const user=await userModel.create({
    email,
    username,
    password:hashPassword,
    role
   });
   
  // Generate JWT token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // not "1hr" -> 1h
    );

    res.status(201).json({
      message:"user created Successfully",
      user,
      token
  });

  }
  catch(err){
  next(err);
  }
}


module.exports.signing=async(req,res,next)=>{
  try{
   const {email,password}=req.body;
   if(!email || !password)return res.status(400).json({message:"All fields are required"});

   const user=await userModel.findOne({email});
   if(!user)return res.status(401).json("Invalid email or password");

   const match=await bcrypt.compare(password,user.password);
   if(!match)return res.status(401).json("Invalid email or password");

  const token=jwt.sign(
    {_id:user._id},
    process.env.JWT_SECRET,
    {expiresIn:'1d'});
  
    res.status(200).json({
      message:"user signed in Successfully",
      user,
      token
    });

  }
  catch(err){
  next(err);
  }
}


module.exports.logout=async(req,res,next)=>{
  try{
  const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing or invalid 1" });
      }

  const token = authHeader.split(" ")[1];
  if(!token){
    return res.status(401).json({message:"Token is required"});
  }
  const isTokenBlacklist=await blacklistModel.findOne({token});
  if(isTokenBlacklist){
    return res.status(400).json({message:"Token is already blacklist"});
  }
  await blacklistModel.create({token});
  return res.status(200).json({ message: "Logout successful, token blacklisted" });
  }
  catch(err){
    next(err);// Forward error to global error handler
  }
}


module.exports.getProfile=async(req,res,next)=>{
  try{
    const user=await userModel.findById(req.user._id);
    res.status(200).json({
      message:"user fetch successfully",
      user
    });
  }
  catch(err){
  next(err);
  }
}

module.exports.getProducts=async(req,res,next)=>{
  try{
  const products=await productModel.find();
  res.status(200).json(
    {products}
  );

  }
  catch(err){
    next(err);
  }
}

module.exports.getProductById=async(req,res,next)=>{
  try{
  const product=await productModel.findById(req.params.id);
  if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
  res.status(200).json(
    {product}
  );
  }
  catch(err){
    next(err);
  }
}


module.exports.createOrder=async(req,res,next)=>{
  try{
    const product=await productModel.findById(req.params.id);

    const options={
      amount:product.price * 100,
      currency:"INR",
      receipt:product._id,
    }
    const order=await instance.orders.create(options);

    res.status(201).json({order});

    const payment=await paymentModel.create({
    orderId:order._id,
    amount:product.price,
    currency:"INR",
    status:"pending"
    })


  }catch(err){
    next(err);
  }
}


module.exports.verifyPayment=async(req,res,next)=>{
  try{
     const {paymentId,orderId,signature}=req.body;
     const secret=process.env.RAZORPAY_KEY_SECRET;

     const {validatePaymentVerification}=require('../node_modules/razorpay/dist/utils/razorpay-utils.js');

     const isValid=validatePaymentVerification(
      {
        payment_id:paymentId,
        order_id:orderId
      },
      signature,
      secret
     );
     if(isValid){
      const payment=await paymentModel.findOne({orderId:orderId});
      payment.paymentId=paymentId,
      payment.status="success",
      payment.signature=signature
      await payment.save();
      res.status(201).json(
        {message:"Payment Verified Success"}
      );
     }
     else{
      const payment=await paymentModel.findOne({orderId:orderId});
      payment.status="failed",
      await payment.save();
      res.status(401).json({
        message:"Payment failed"
      })
     }

  } catch(err){
    next(err);
  }
}


// Make sure this comes after all your routes in your main app file (e.g. app.js):
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Internal Server Error", error: err.message });
// });


