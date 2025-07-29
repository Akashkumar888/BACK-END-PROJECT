
const express=require('express');
const app=express();

const cors=require(cors);
app.use(cors());// sare route le liye data sharable hai 


app.get("/",function(req,res,next){
  res.send("hello...");
})



// kevel is route ke liye data sharaeble hai 
app.get("/sharable",cors(), function(req,res,next){
  res.send("hello...");
})


app.listen(3000);

