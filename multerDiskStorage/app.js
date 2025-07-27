
require('dotenv').config();

const express=require('express');
const app=express();
const path=require('path');
const connectDB=require('./config/db');
connectDB();

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

const userModel=require('./models/userModel');

// app.get('/',(req,res)=>{
//   res.send('Hello dost yh mai aur ye mera dost chiku...');
// })

app.get('/',(req,res)=>{
  res.render("index");
})

const upload=require('./multerSetup');

app.post('/upload',upload.single('image'),async function(req,res){
  console.log(req.file);
  const akash=await userModel.create({
    name:'akash',
    image:req.file.filename,
  })
  res.send({ message: 'Files uploaded...', akash });
})





app.listen(3000,()=>{
  console.log(`Server is running on Port:http://localhost:3000`);
})


