const mongoose = require("mongoose");
const Joi = require("joi");

// 🔔 Notification Schema (Mongoose)
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    message: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Joi Validation Function
const validateNotification = (data) => {
  const Schema = Joi.object({
    user: Joi.string().hex().length(24).required(), // MongoDB ObjectId
    message: Joi.string().min(3).max(255).required(),
    read: Joi.boolean().optional(),
  });

  return Schema.validate(data);
};

// ✅ Export both
module.exports = {
  notificationModel: mongoose.model("notification", notificationSchema),
  validateNotification,
};


