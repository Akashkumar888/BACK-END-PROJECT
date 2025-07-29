

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
const sharp = require('sharp');

app.post('/upload',upload.single('image'),async function(req,res){
  if(!req.file)return res.send('File not found...');
  let newBuffer=req.file.buffer;
  // because const value can not be changed ok 
try{

  if(req.file.size>2*1024*1024){
    newBuffer=await sharp(req.file.buffer).resize({width:1000})
   .toBuffer();
  }

 console.log(`Purana size: ${req.file.size}`);
 console.log(`Naya size:${Buffer.byteLength(newBuffer)}`)

  const akash=await userModel.create({
        name:'another akash',
        image:newBuffer
  })
  res.send({message :'File uploaded'});

}
catch(err){
   console.error(err); // 👍 Optional: logs error for debugging
    res.status(404).send('bad gateway'); // You could also use 502
}
})


app.get('/show',async function(req,res){
  const files=await userModel.find();
  res.render('show',{files});
})



app.listen(3000,()=>{
  console.log(`Server is running on Port:http://localhost:3000`);
})



