

const mongoose=require('mongoose');


const userSchema=new mongoose.Schema(
  {
  name:String,
  username:String,
  image:String
  }
);




module.exports=mongoose.model('User',userSchema);



