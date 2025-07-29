
const mongoose=require('mongoose');

const dbConnect=function (){
  mongoose.connect(process.env.MONGO_URI).
  then(function(){
    console.log('Database connection Successfully...');
  })
  .catch(function(err){
    console.log('Database connection failed...');
    process.exit(1);
  })
}

module.exports=dbConnect;
