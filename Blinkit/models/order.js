const mongoose = require("mongoose");
const Joi = require("joi");

// 📦 Order Schema (Mongoose)
const orderSchema = new mongoose.Schema(
  {
    orderId:{
      type:String,
      required:true
    },
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
    address: {
      type: String,
      minlength: 5,
      maxlength: 255,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment",
      required: true,
    },
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "delivery",
    },
  },
  { timestamps: true }
);

// ✅ Joi Validation Function
const validateOrder = (data) => {
  const Schema = Joi.object({
    orderId:Joi.string.required(),
    user: Joi.string().required(), // MongoDB ObjectId
    products: Joi.array().items(Joi.string().required()).required(), // list of ObjectIds
    totalPrice: Joi.number().min(0).required(),
    address: Joi.string().min(5).max(255).required(),
    status: Joi.string()
      .valid("pending", "processing", "confirmed", "shipped", "delivered", "cancelled")
      .required(),
    payment: Joi.string().required(), // MongoDB ObjectId
    delivery: Joi.string().optional(), // MongoDB ObjectId
  });

  return Schema.validate(data);
};

// ✅ Export both
module.exports = {
  orderModel: mongoose.model("order", orderSchema),
  validateOrder,
};
