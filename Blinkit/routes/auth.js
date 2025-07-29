

const express=require('express');
const passport=require('passport');
const router=express.Router();



router.get('/google',passport.authenticate("google",{
  scope:['profile','email']
}),(req,res)=>{}
);


router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/products',
    failureRedirect: '/',
  })
);



router.post('/logout',(req,res,next)=>{
 req.logOut(function(err){
  if(err)return next(err);
  res.redirect('/');
 })
});


module.exports=router;



