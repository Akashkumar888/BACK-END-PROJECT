const mongoose = require("mongoose");
const Joi = require("joi");

// 💳 Payment Schema (Mongoose)
const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    signature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

// ✅ Joi Validation Function
const validatePayment = (data) => {
  const Schema = Joi.object({
    orderId: Joi.string().required(),
    paymentId: Joi.string().optional(),
    signature: Joi.string().optional(),
    amount: Joi.number().min(0).required(),
    currency: Joi.string().required(),
    status: Joi.string().valid("pending", "success", "failed").optional(),
  });

  return Schema.validate(data);
};

module.exports = {
  paymentModel: mongoose.model("payment", paymentSchema),
  validatePayment,
};


