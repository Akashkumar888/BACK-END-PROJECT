import blacklistTokenModel from "../models/blacklistToken.model.js";
import userModel from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import {validationResult} from 'express-validator'
import { redisClient } from "../config/redis.js";


export const registerUser=async(req,res)=>{
  try {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }
    const {fullName,email,password}=req.body;
  
    const hashedPassword = await userModel.hashPassword(password);

    const user=await createUser({
      firstname:fullName.firstname,
      lastname:fullName.lastname,
      email,
      password:hashedPassword
    })
    const token=user.generateAuthToken();
    res.json({sucess:true,token,user});
    
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message});
  }
} 




export const loginUser=async(req,res)=>{
  try {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({success:false,errors:errors.array()});
    }
    const  {email,password}=req.body;
    const user=await userModel.findOne({email}).select("+password"); // beacuse i did select:false in userModel 
    if(!user)return res.status(401).json({success:false,message:"Invalid credentials."});
    const ismatch=await user.comparePassword(password);
    if(!ismatch)return res.status(401).json({success:false,message:"Invalid credentials."});

    // 🔹 Generate a fresh token on login
    const token=user.generateAuthToken(); // req.headers.authorization

    res.cookie("token", token); // cookie


    res.json({success:true,
      message:"login Successfully.",
      token, // raw JWT return the raw token (not "Bearer ").
      user
    });
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message});
  }
}


// export const getUserProfile=async(req,res)=>{
//   try {
//     res.json({success:true,user:req.user});
//   } catch (error) {
//     console.log(error);
//     res.json({success:false,message:error.message});
//   }
// }


export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    // 1️⃣ Check cache first
    const cachedUser = await redisClient.get(`user:${userId}`);
    if (cachedUser) {
      return res.json({ success: true, user: JSON.parse(cachedUser), source: "redis" });
    }

    // 2️⃣ If not in cache, get from DB
    const user = await userModel.findById(userId).select("-password");

    // 3️⃣ Store in Redis for 1 hour
    await redisClient.setEx(`user:${userId}`, 3600, JSON.stringify(user));

    res.json({ success: true, user, source: "mongodb" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



export const logoutUser=async(req,res)=>{
  try {
    res.clearCookie('token');
    let token;
    const authHeader=req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer ")){
      token=authHeader.split(" ")[1];
    }
    else if(req.cookies && req.cookies.token){
      token=req.cookies.token;
    }
    if(!token)return res.json({success:false,message:"Token not found"});

    // ✅ Store in Redis with TTL (24h)
    await redisClient.setEx(`blacklist:${token}`, 86400, "true");

    // await blacklistTokenModel.create({token});
    res.json({success:true,message:"Log out"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
}