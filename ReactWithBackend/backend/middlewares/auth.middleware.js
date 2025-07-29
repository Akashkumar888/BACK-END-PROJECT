require('dotenv').config();
const userModel=require('../models/user.model');
const jwt=require('jsonwebtoken');
const blacklistModel=require('../models/blacklist.model');


module.exports.isAuthenticated=async(req,res,next)=>{
  try{
  const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing or invalid 2" });
      }

  const token = authHeader.split(" ")[1];

  const isTokenBlacklist=await blacklistModel.findOne({token});
  if(isTokenBlacklist){
    return res.status(401).json({message:"unauthorized"});
  }

  const decoded=jwt.verify(token,process.env.JWT_SECRET);
  const user=await userModel.findById(decoded._id);
  if(!user){
    return res.status(401).json({message:"unauthorized user"});
  }
  req.user=user;
  next();
  }
  catch(err){
    next(err);
  }
}


module.exports.isSeller=async(req,res,next)=>{
  try{
  const user=req.user;
  if(user.role !== "seller"){
    return res.status(401).json({message:"Unauthorized"});
  }
  next();
  }
  catch(err){
    next(err);
  }
}

