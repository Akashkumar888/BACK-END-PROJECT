
const { string } = require('joi');
const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
  name:String,
  username:String
});


module.exports=mongoose.model('User',userSchema);

