
const express=require('express');
const router=express.Router();
const {userModel,validateUser}=require('../models/user');


router.get('/login',(req,res)=>{
  res.render('user_login');
});

router.use("/profile",(req,res)=>{
  res.redirect('/admin/products');
})


router.get('/logout',(req,res,next)=>{
  req.logOut(function(err){
    if(err){
      return next(err);
    }
    req.session.destroy((err)=>{
    if(err)return next(err);
    res.clearCookie("connect.sid");
    res.redirect('/users/login');
    })
  })
});




module.exports=router;

