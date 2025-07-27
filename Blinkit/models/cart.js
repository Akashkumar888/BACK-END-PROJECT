

const mongoose = require("mongoose");
const Joi = require("joi");

// 🛒 Cart Schema (Mongoose)
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);


// ✅ Joi Validation Function
const validateCart = (data) => {
  const Schema = Joi.object({
    user: Joi.string().required(), // expecting ObjectId string
    products: Joi.array().items(Joi.string().required()).required(),
    totalPrice: Joi.number().min(0).required(),
  });

  return Schema.validate(data);
};



// ✅ Export both
module.exports = {
  cartModel: mongoose.model("cart", cartSchema),
  validateCart,
};









// const mongoose=require('mongoose');

// const cartSchema=new mongoose.Schema({
//  user:{
//   type:mongoose.Schema.Types.ObjectId,
//   ref:"user"
//  },
// //  ✅ This represents the user who owns the cart.
// // type: mongoose.Schema.Types.ObjectId means it stores the MongoDB ObjectId of a user.
// // ref: "user" sets up a reference to the "user" collection, allowing you to populate user details later.
//  products:[
//   {
//   type:mongoose.Schema.Types.ObjectId,
//   ref:"product"
// }],
//  totalPrice:Number
// });


// module.exports=mongoose.model('cart',cartSchema);


