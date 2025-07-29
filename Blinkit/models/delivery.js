const mongoose = require("mongoose");
const Joi = require("joi");

// 📦 Delivery Schema (Mongoose)
const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
    },
    deliveryBoy: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in-transit", "delivered", "cancelled"],
    },
    trackingUrl: {
      type: String,
    },
    estimatedDeliveryTime: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// ✅ Joi Validation Function
const validateDelivery = (data) => {
  const Schema = Joi.object({
    order: Joi.string().required(), // stricter ObjectId validation
    deliveryBoy: Joi.string().min(3).max(50).required(),
    status: Joi.string()
      .valid("pending", "in-transit", "delivered", "cancelled")
      .required(),
    trackingUrl: Joi.string().uri(),
    estimatedDeliveryTime: Joi.number().min(0).required(),
  });

  return Schema.validate(data);
};

// ✅ Export both
module.exports = {
  deliveryModel: mongoose.model("delivery", deliverySchema),
  validateDelivery,
};


