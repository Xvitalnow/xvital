import express from "express";
import { createOrder, verifyAndSaveOrder,  sendOrderOTP,
  verifyOrderOTPAndGetOrders, } from "../controllers/order.controllers.js";
const router = express.Router();
router.post("/order/create", createOrder);
router.post("/order/verify", verifyAndSaveOrder);
router.post("/order/send-otp", sendOrderOTP);
router.post("/order/verify-otp", verifyOrderOTPAndGetOrders);

export default router;