
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import blacklistTokenModel from '../models/blacklistToken.model.js';
import { redisClient } from "../config/redis.js";

export const authUser = async (req, res, next) => {
  try {
    let token;

    // Try Authorization header first
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } 
    else if (req.cookies && req.cookies.token) {
      // If no header, try cookies
      token = req.cookies.token;
    }

    // If still no token found
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided." });
    }
    
    // const isBlackList=await blacklistTokenModel.findOne({token:token});
    // if(isBlackList){
    //   return res.status(401).json({ success: false, message: "Unauthorized access"});
    // }
    

    // ✅ Check Redis for blacklist
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ success: false, message: "Token is blacklisted" });
    }


    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user
    const user = await userModel.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found." });
    }

    req.user = user; // attach user
    next();

  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};







































// import jwt from 'jsonwebtoken'
// import userModel from '../models/user.model.js';

// export const authUser=async(req,res,next)=>{
//   try {
//     let token= req.cookies.token;
//     const authHeader=req.headers.authorization;
//     if(!authHeader || !authHeader.startsWith("Bearer ")){
//       return res.status(401).json({success:false,message:'No token provided.'});
//     }
//     // Authorization header (most common in REST APIs)
//     // req.cookies.token (if you’re storing JWT in an HTTP-only cookie, often for web apps for security against XSS).
//     // res.cookie("token", jwtToken, { httpOnly: true, secure: true });

//     token=authHeader.split(" ")[1] || req.cookies.token;
//     const decoded=jwt.verify(token,process.env.JWT_SECRET); // it only store { _id: this._id }

//     const user=await userModel.findById(decoded._id); 
//     req.user=user;// attach user payload (id, email, etc.)

//     next();
//   } catch (error) {
//     res.status(401).json({ success: false, message: "Invalid or expired token" });
//   }
// }

