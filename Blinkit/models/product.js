

const mongoose = require("mongoose");
const Joi = require("joi");

// 🛍️ Product Schema (Mongoose)
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    stock: {
      type: Number,
      required:true,
    },
    description: {
      type: String,
    },
    image: {
      type: Buffer,
    },
    imageType: {
      type: String
    }

  },
  { timestamps: true }
);


// ✅ Joi Validation Function
const validateProduct = (data) => {
  const Schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().min(3).max(50).required(),
    stock: Joi.number().required(),
    description: Joi.string().optional(),
    image: Joi.any().optional(), // or just remove it from Joi if you're not sending image in body
    imageType:Joi.string().optional(),
  });

  
  return Schema.validate(data);
};

// ✅ Export both
module.exports = {
  productModel: mongoose.model("product", productSchema),
  validateProduct,
};


