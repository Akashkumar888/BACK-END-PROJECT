


const mongoose=require('mongoose');


const userSchema=new mongoose.Schema(
  {
  name:String,
  image:Buffer // 🔸 store binary data in MongoDB
  }
);


module.exports=mongoose.model('User',userSchema);



