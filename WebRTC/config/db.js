
const mongoose=require('mongoose');

// ✅ Recommended (Modern) Style:

const dbConnect=async function(){
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connection Successfully...');
  } 
  catch (err) {
    console.error('Database connection failed...', err);
    process.exit(1);
  }
}

module.exports=dbConnect;

