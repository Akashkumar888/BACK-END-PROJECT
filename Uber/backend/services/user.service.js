
import userModel from "../models/user.model.js";

export const createUser=async({firstname,lastname,email,password})=>{
  if(!firstname || !email || !password){
    throw new Error("All feilds are required.")
  }
  const user=await userModel.create({
    fullName:{
      firstname,
      lastname,
    },
    email,
    password,
  })
  return user;
}

