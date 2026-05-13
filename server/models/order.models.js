import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 👤 USER INFO
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },

    // 📦 PACKAGE INFO
    packageId: {
      type: String,
      enum: ["reset", "control"],
      required: true,
    },

    packageName: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    isTemp: {
      type: Boolean,
      default: false,
    },

    expiryDate: {
      type: Date,
    },
    isActive: {
  type: Boolean,
  default: true,
},

    // 💳 PAYMENT INFO
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,

    // 📊 STATUS
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    // 🧠 USER ANSWERS
    answers: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);