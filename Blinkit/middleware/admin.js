require('dotenv').config();
const jwt=require('jsonwebtoken');
const passport=require('passport');


async function validateAdmin(req,res,next){
  try{
    let token=req.cookies.token;
    if(!token)return res.send("You need to login first...");
    let data=await jwt.verify(token,process.env.JWT_KEY);
    req.user=data;// Attach decoded token payload to req.user
    next();// Allow the request to proceed
  }
  catch(err){
  res.status(401).send("Invalid or expired token. Please log in again.");
  }
}



async function userIsLoggedIn(req,res,next){
  if(req.isAuthenticated())return next();
  res.redirect('/users/login');
}

module.exports=
{validateAdmin,userIsLoggedIn};


