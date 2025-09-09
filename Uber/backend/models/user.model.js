
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import  jwt  from "jsonwebtoken";

const userSchema=new mongoose.Schema({
  fullName:{
    firstname:{
      type:String,
      required:true,
      minlength:[3,'First name must be atleast 3 characters long.'],
    },
    lastname:{
      type:String,
      minlength:[3,'Last name must be atleast 3 characters long.'],
    },
  },
  email:{
    type:String,
    required:true,
    unique:true,
    minlength:[5,'Email must be at least five characters long']
  },
  password:{
    type:String,
    required:true,
    select:false
  },
  socketId:{
    type:String,
  }
},{timestamps:true});


// methods vs statics in Mongoose
// 1. Instance Methods (schema.methods)
// Belong to a single document (row in DB).
// Can access this → which represents the specific user document.
// Used when you need to do something with one record.

userSchema.methods.generateAuthToken = function() {
  // here "this" = specific user document
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET,{expiresIn:'24h'});
};

userSchema.methods.comparePassword = async function(password) {
  // here "this.password" = hashed password of that specific user
  return await bcrypt.compare(password, this.password);
};

// Static Methods (schema.statics)
// Belong to the entire Model (table).
// Used when you want to perform an operation on the collection as a whole (not a single document).
// No direct this.password etc., because this here = the model class.

userSchema.statics.hashPassword=async(password)=>{
  return await bcrypt.hash(password,10);
}


const userModel=mongoose.models.User || mongoose.model("User",userSchema);
export default userModel;
