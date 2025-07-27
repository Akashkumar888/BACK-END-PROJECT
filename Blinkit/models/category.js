

const mongoose = require("mongoose");
const Joi = require("joi");

// 🏷️ Category Schema (Mongoose)
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
    },
  },
  { timestamps: true }
);

// ✅ Joi Validation Function
const validateCategory = (data) => {
  const Schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
  });

  return Schema.validate(data);
};

// ✅ Export both
module.exports = {
  categoryModel: mongoose.model("category", categorySchema),
  validateCategory,
};



