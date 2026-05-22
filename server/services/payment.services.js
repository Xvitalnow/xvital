import Razorpay from "razorpay";
import crypto from "crypto";

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("ENV ERROR:", process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);
    throw new Error("Razorpay env not loaded");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

export const createRazorpayOrder = async (amount) => {
  const razorpay = getRazorpayInstance(); // 👈 now safe
  return await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
  });
};

export const verifyRazorpayPayment = (payment) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature 
    } = payment;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  return expectedSign === razorpay_signature;
};