
const mongoose = require("mongoose");
const Joi = require("joi");

// 🧩 Admin Schema (Mongoose)
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "superadmin"], // optional restriction
    },
  },
  { timestamps: true }
);

// ✅ Joi validation function
const validateAdmin = (data) => {
  const Schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "superadmin").required(), // matches enum above
  });

  return Schema.validate(data);
};

// ✅ Export both
module.exports = {
  adminModel: mongoose.model("admin", adminSchema),
  validateAdmin,
};

