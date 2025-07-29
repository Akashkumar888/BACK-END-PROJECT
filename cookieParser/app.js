
const express=require('express');
const app=express();


const cookieParser=require('cookie-parser');

app.use(cookieParser());

app.get("/",(req,res,next)=>{
  res.send("Hello EveryOne");
})



app.get('/check',function(req,res,next){
  console.log(req.cookies.name);
  res.send("checking...");
})



app.get("/banned",function(req,res,next){
  res.cookie("name","Akash");
  res.send("Banned...");
})

app.listen(3000);

