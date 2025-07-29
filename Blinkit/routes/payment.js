require('dotenv').config();

const Razorpay = require("razorpay");
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { paymentModel } = require('../models/payment');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// 🧾 Create Order
router.post("/create/orderId", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100 || 5000 * 100, // amount in paise
      currency: currency || "INR",
    };

    const order = await razorpay.orders.create(options);

    // Save to DB
    await paymentModel.create({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "pending",
    });

    res.status(200).json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});



// ✅ Verify Payment Signature
router.post("/api/payment/verify", async (req, res) => {
  const {razorpayOrderId,razorpayPaymentId,signature } = req.body;
  const secret=process.env.RAZORPAY_KEY_SECRET;
  try{
  const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");


  const isValid=validatePaymentVerification({
    order_id:razorpayOrderId,
    payment_id:razorpayPaymentId,
  },
  signature,
  secret);

  if (isValid) {
      const payment = await paymentModel.findOne({ orderId: razorpayOrderId,status:"pending" });
      if (!payment) {
        return res.status(404).json({ status: "error", message: "Payment record not found" });
  }

      payment.paymentId = razorpayPaymentId;
      payment.signature = signature;
      payment.status = "completed";
      await payment.save();

      res.status(200).json({ status: "success" });
    } 
    else {
      res.status(400).json({ status: "error", message: "Invalid signature" });
    }
  } 
  catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ status: "error", message: "Error verifying payment" });
  }
});



module.exports = router;


