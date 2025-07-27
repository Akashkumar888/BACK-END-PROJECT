

const mongoose=require('mongoose');

const connectDB=async ()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URL)
      console.log('Database connected Successfully...');
  }
  catch(err){
    console.log('Database connection failed...',err);
    process.exit(1);
  }
}
module.exports=connectDB;


