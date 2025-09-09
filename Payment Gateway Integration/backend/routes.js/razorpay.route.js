import express from "express";
import { createOrder, verifyOrder } from "../controllers/razorpay.controllers.js";

const razorpayRouter = express.Router();

razorpayRouter.post("/create-order", createOrder);
razorpayRouter.post("/verify-order", verifyOrder);

export default razorpayRouter;
