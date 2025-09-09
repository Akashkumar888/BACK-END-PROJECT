
import mongoose from "mongoose";
// using ttl-> time to live 
const blackListTokenSchema=new mongoose.Schema({
  token:{
    type:String,
    required:true,
    unique:true,
  },
  createdAt:{
    type:Date,
    default:Date.now(),
    expires:86400 // 24 hours in seconds 
  }
});

const blacklistTokenModel=mongoose.models.BlackList || mongoose.model("BlackList",blackListTokenSchema);

export default blacklistTokenModel;

