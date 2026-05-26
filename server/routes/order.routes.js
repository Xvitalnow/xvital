import express from "express";
import { createOrder, verifyAndSaveOrder,  sendOrderOTP,
  verifyOrderOTPAndGetOrders, deleteAllOrders } from "../controllers/order.controllers.js";
const router = express.Router();
router.post("/order/create", createOrder);
router.post("/order/verify", verifyAndSaveOrder);
router.post("/order/send-otp", sendOrderOTP);
router.post("/order/verify-otp", verifyOrderOTPAndGetOrders);
// router.get("/orders/delete", deleteAllOrders); // for testing purposes only
export default router;