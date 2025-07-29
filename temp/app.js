
require('dotenv').config();

const express=require('express');
const app=express();
const path=require('path');
const fs=require('fs');
const dbConnect=require('./config/db');

app.set("view engine",'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));


dbConnect();

// ✅ Ensure ./hisaab folder exists
const hisaabPath = path.join(__dirname, 'hisaab');
if (!fs.existsSync(hisaabPath)) {
  fs.mkdirSync(hisaabPath, { recursive: true });
}





app.get("/", function(req, res, next) {
  fs.readdir("./hisaab", function(err, data) {
    if (err) return res.status(500).send(err); // fixed: remove extra res
    res.render("index", { files: data }); // pass correct variable
  });
});


app.get('/create',function(req,res,next){
  res.render("create");
})


app.get("/edit/:filename",function(req,res,next){
  fs.readFile(`./hisaab/${req.params.filename}`,'utf-8',function(err,filedata){
    if(err)return res.status(500).send(err);
    res.render("edit",{filedata,filename : req.params.filename});
  })
})


app.post("/update/:filename",function(req,res,next){
   fs.writeFile(`./hisaab/${req.params.filename}`,req.body.content,function(err){
    if(err)return res.status(500).send(err);
    res.redirect("/");
   });
})



app.get("/hisaab/:filename",function(req,res){
  fs.readFile(`./hisaab/${req.params.filename}`,'utf-8',function(err,filedata){
    if(err)return res.status(500).send(err);
    res.render("hisaab",{filedata ,filename : req.params.filename});
  })

})



app.get("/delete/:filename",function(req,res){
  fs.unlink(`./hisaab/${req.params.filename}`,function(err){
    if(err)return res.status(500).send(err);
    res.redirect("/");
  })
})



app.post("/createhisaab",function(req,res,next){
  var currentDate=new Date();
  var DateTime=`${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`;
  // console.log(DateTime);
  fs.writeFile(`./hisaab/${DateTime}.txt`,req.body.content,function(err){
    if(err)return res.status(500).send(err);
    res.redirect("/");
  });

});



// app.listen(3000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});









