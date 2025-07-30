
const express = require("express");
const router = express.Router();
const authMiddleware=require('../middlewares/auth.middleware');
const {
  createOrder,
  verifyPayment,
  getKey,
} = require("../controllers/payment.controller");

router.get("/getkey", getKey);
router.post("/order",authMiddleware.isAuthenticated, createOrder);
router.post("/verify",authMiddleware.isAuthenticated, verifyPayment);

module.exports = router;



