require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // allow Vite dev server

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Send public Razorpay key to frontend
app.get("/getkey", (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});


// Create order
app.post("/order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount,
      currency: req.body.currency,
      receipt: req.body.receipt,
    };

    const order = await razorpay.orders.create(options);
    if (!order) return res.status(400).send("Order creation failed");

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Validate payment
app.post("/validate", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");

  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction not legit" });
  }

  res.json({
    msg: "Transaction verified",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});

