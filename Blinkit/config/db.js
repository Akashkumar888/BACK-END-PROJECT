
const mongoose=require('mongoose');

const dbConnect=async ()=>{
 try{
 await mongoose.connect(process.env.MONGODB_URI);
 console.log('Database connected Successfully...');
 }
 catch(err){
 console.log('Database connection failed...');
 process.exit(1);
 }
};

module.exports=dbConnect;

