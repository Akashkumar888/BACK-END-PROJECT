

const mongoose = require("mongoose");
const Joi = require("joi");

// 🧩 Embedded Address Schema (Mongoose)
const addressSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  city: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  zip: {
    type: Number,
    required: true,
    min: 10000,
    max: 999999,
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
});

// 🧩 User Schema (Mongoose)
const userSchema = new mongoose.Schema(
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
      minlength: 6,
    },
    phone: {
      type: String,
      match: /^[0-9]{10}$/,
    },
    addresses: [addressSchema],
  },
  { timestamps: true }
);



// ✅ Validation function
const validateUser = (data) => {
  const Schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    addresses: Joi.array()
      .items(
        Joi.object({
          state: Joi.string().min(2).max(50).required(),
          city: Joi.string().min(2).max(50).required(),
          zip: Joi.number().min(10000).max(999999).required(),
          address: Joi.string().min(5).max(255).required(),
        })
      )
      .max(5),
  });

  return Schema.validate(data);
};

// ✅ Export both
module.exports = { 
  userModel : mongoose.model("user", userSchema), 
  validateUser };



// What it does: Creates a Mongoose model named "User" using userSchema and exports it.
// Why:
// "User" becomes the name of the collection in MongoDB → Mongoose will pluralize it to users.
// You can use this model in other files to interact with the users collection (create, read, update, delete).

// Export directly
// const User = mongoose.model("user", userSchema);
// module.exports = User;

// Or with ES6 exports (if you're using "type": "module" in package.json):
// export default mongoose.model("User", userSchema);

