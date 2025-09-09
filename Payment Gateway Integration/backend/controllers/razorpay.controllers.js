import razorpayInstance from "../configs/razorPay.configs.js";
import validatePayment from "../utils/validatePayment.js";



export const createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount,      // amount in smallest currency unit (paise)
      currency: req.body.currency,  // "INR"
      receipt: req.body.receipt,    // unique receipt ID
    };

    const order = await razorpayInstance.orders.create(options);
    if (!order) {
      return res.status(400).json({ success: false, message: "Order creation failed" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};





export const verifyOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const isValid = validatePayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Transaction not legit" });
    }

    res.json({
      success: true,
      message: "Transaction verified",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

