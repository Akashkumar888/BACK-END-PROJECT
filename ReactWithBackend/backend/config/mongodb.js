require('dotenv').config();
const mongoose=require('mongoose');

const connectDB=async()=>{
 try{
  await mongoose.connect(process.env.MONGO_URI)
  console.log("MongoDB connected Succesfully");
  
}
catch(err){
  console.log("MongoDB connection failed");
  console.log("Connecting to:", process.env.MONGO_URI);
  process.exit(1);
 }
}

module.exports=connectDB;




