
const express=require('express');

const router=express.Router();

// const data=require('../data');
// router.get('/',function(req,res){
//   res.render('index',{data});
// })



// const userModel=require('../models/userModels');

// router.post('/create',async function(req,res){
//   const {name,username}=req.body;
// try{
// const user= await userModel.create({
//     name:name,
//     username:username
//   });
//   res.send(user);

// }
// catch(err){
//   res.status(404).send('Bad gateway');
// }
// });



module.exports=router;

