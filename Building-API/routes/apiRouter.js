

const express=require('express');
const router=express.Router();

// const data=require('../data');
// router.get('/',function(req,res){
//   res.json(data);
// })


// const userModel=require('../models/userModels');


// router.post('/create',async function(req,res){

//   const {name,username}=req.body;
//   try{
//   const user=await userModel.create({
//     name:name,
//     username:username
//   });
//   res.json(user);
//   // res.json({success:true,message:'User created Succesfully...'});

//   }
//   catch(err){
//     res.json({success:false,message:err.message});
//   }

// });



const users=[
  {_id:'1',name:'john'},
  {_id:'2',name:'william crystopher'}
];


router.get('/users',async function(req,res){
try{
   res.json(users);
}
catch(err){
  res.status(404).send('Bad Gateway...');
}
});

router.post('/users/create',function(req,res){
  let idx=Math.floor(Math.random()*10);
  users.push({_id:idx , name:req.body.name});
  res.json(users);
})

router.get('/users/:id',async function(req,res){
  const user=users.find(ele=>ele._id === req.params.id);
 if (user) {
    res.json(user);
  } else {
  res.json({success:false, message: "User not found" });
  }
})

module.exports=router;


