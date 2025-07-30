
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.getKey = (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    });

    res.status(200).json({ order });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Order creation failed", error });
  }
};

exports.verifyPayment = (req, res) => {
  const { paymentId, orderId, signature } = req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(orderId + "|" + paymentId);
  const digest = hmac.digest("hex");

  if (digest === signature) {
    res.status(200).json({ success: true, message: "Payment verified" });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
};

