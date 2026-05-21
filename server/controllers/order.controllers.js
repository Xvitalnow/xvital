import Order from "../models/order.models.js";
import {
  verifyRazorpayPayment,
  createRazorpayOrder,
} from "../services/payment.services.js";

import { createZohoDealOrder } from "../services/zoho.services.js";

import { generateReceiptPDF } from "../services/reciept.services.js";
import { sendEmail, generateOTP } from "../services/email.services.js";
import fs from "fs";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageDetails = {
  reset: { name: "Reset Protocol", amount: 25000, duration: 30 },
  control: { name: "Control Protocol", amount: 80000, duration: 90 },
};

// ============================
// ✅ CREATE ORDER (Razorpay)
// ============================
export const createOrder = async (req, res) => {
  try {
    const { packageId } = req.body;

    const selectedPackage = packageDetails[packageId];

    if (!selectedPackage) {
      return res.status(400).json({ error: "Invalid package" });
    }

    const order = await createRazorpayOrder(selectedPackage.amount * 100); 

    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: "Order creation failed" });
  }
};

// ============================
// ✅ VERIFY + SAVE + SUBSCRIPTION LOGIC
// ============================
export const verifyAndSaveOrder = async (req, res) => {
  try {
    const { payment, userData, packageId } = req.body;

    if (!payment || !packageId || !userData) {
      return res.status(400).json({
        success: false,
        error: "Missing required data",
      });
    }

    const isValid = verifyRazorpayPayment(payment);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: "Invalid payment signature",
      });
    }

    const selectedPackage = packageDetails[packageId];

    if (!selectedPackage) {
      return res.status(400).json({
        success: false,
        error: "Invalid package",
      });
    }

    const normalizedEmail = userData.email?.toLowerCase();

    // 🔁 CHECK ACTIVE PLAN
    let existingOrder = await Order.findOne({
      email: normalizedEmail,
      packageId,
      status: "success",
      expiryDate: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    let expiryDate;

    if (existingOrder) {
      expiryDate = new Date(existingOrder.expiryDate);
      expiryDate.setDate(
        expiryDate.getDate() + selectedPackage.duration
      );
    } else {
      expiryDate = new Date();
      expiryDate.setDate(
        expiryDate.getDate() + selectedPackage.duration
      );
    }

    // 💾 SAVE ORDER (history intact)
    const order = await Order.create({
      name: userData.name || "Unknown",
      email: normalizedEmail,
      phone: userData.phone || "Unknown",

      packageId,
      packageName: selectedPackage.name,
      amount: selectedPackage.amount,

      duration: selectedPackage.duration,
      expiryDate,

      razorpay_order_id: payment.razorpay_order_id,
      razorpay_payment_id: payment.razorpay_payment_id,
      razorpay_signature: payment.razorpay_signature,

      status: "success",
      answers: userData.answers || {},
    });

    try {
      await createZohoDealOrder(order);
    } catch { }

    try {
      const pdfPath = await generateReceiptPDF({
        name: order.name,
        email: order.email,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        paymentId: order.razorpay_payment_id,
      });


      const freeGiftPath = path.join(process.cwd(), "public/pdf/freegift.pdf")
      // const welcomeKitPath = path.join(process.cwd(), "public/pdf/welcomekit.pdf");

      await sendEmail(
        "XVITAL <orders@xvital.in>",
        order.email,
        `Welcome to XVITAL 💜 ${order.name}`,
        {
          name: order.name, type: "order",
          packageName: order.packageName,
        },
        [pdfPath, freeGiftPath,
        ]);
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    } catch (err) {
      console.error("Email sending failed:", err);
    }

    return res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("Error occurred while verifying and saving order:", err);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// ============================
// ✅ SEND OTP
// ============================
export const sendOrderOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    let order = await Order.findOne({ email: normalizedEmail })
      .sort({ createdAt: -1 });

    if (!order) {
      order = await Order.create({
        name: "User",
        email: normalizedEmail,
        phone: "NA",
        packageId: "reset",
        amount: 0,
        status: "pending",
        isTemp: true,
      });
    }

    order.otp = otp;
    order.otpExpiresAt = expiresAt;

    await order.save();

    await sendEmail(
      "XVITAL <orders@xvital.in>",
      normalizedEmail,
      "Your OTP Code",
      `${otp}`,

    );

    return res.json({
      success: true,
      message: "OTP sent",
    });
  } catch {
    return res.status(500).json({ success: false });
  }
};

// ============================
// ✅ VERIFY OTP + GET ACTIVE PLANS
// ============================
export const verifyOrderOTPAndGetOrders = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const latestOrder = await Order.findOne({
      email: normalizedEmail,
    }).sort({ createdAt: -1 });

    if (!latestOrder || !latestOrder.otp) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request again.",
      });
    }

    if (latestOrder.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (
      !latestOrder.otpExpiresAt ||
      new Date() > latestOrder.otpExpiresAt
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    latestOrder.otp = null;
    latestOrder.otpExpiresAt = null;
    await latestOrder.save();

    const orders = await Order.find({
      email: normalizedEmail,
      status: "success",
      isTemp: { $ne: true },
    }).sort({ createdAt: -1 });

    // ✅ KEEP ONLY LATEST PLAN PER PACKAGE
    const uniqueOrders = Object.values(
      orders.reduce((acc, order) => {
        if (!acc[order.packageId]) {
          acc[order.packageId] = order;
        }
        return acc;
      }, {})
    );

    return res.json({
      success: true,
      orders: uniqueOrders,
    });
  } catch {
    return res.status(500).json({ success: false });
  }
};