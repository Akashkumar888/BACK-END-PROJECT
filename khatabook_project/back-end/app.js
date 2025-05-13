
const express=require('express');
const path=require('path');
const app=express();
const fs=require('fs');
const { send } = require('process');


app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));





app.get('/',function(req,res,next){
  res.send("Hey");
})


app.get('/create',(req,res,next)=>{
  const currentDate=new Date();
  const Day=String(currentDate.getDate()).padStart(2,'0');
  const month=String(currentDate.getMonth()+1).padStart(2,'0');
  const year=currentDate.getFullYear();
  const fn=`${Day}-${month}-${year}.txt`;
  fs.writeFile(`./files/${fn}`,"Daal Cheeni", function(err){
  if(err)return res.send("Somethings went wrong...");
  else res.send("Done...");
  })
})

app.get('/files',function(req,res,next){
  const fn=fs.readdir(`./files`,function(err,files){
    res.render("index",{files});

  })
})


app.get("/edit/:filename",function(req,res,next){
  fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,data){
    if(err) return res.send(err);
    return res.render("edit",{data,filename: req.params.filename});
  })
})


app.post("/update/:filename",function(req,res,next){
  fs.writeFile(`./files/${req.params.filename}`, req.body.filedata,function(err){
    if(err) return res.send(err);
    return res.redirect("/");
  })
})


app.get("/delete/:filename",function(req,res,next){
  fs.unlink(`./files/${req.params.filename}`,function(err){
    if(err) return res.send(err);
    return res.redirect("/");
  })
})






app.listen(3000);




