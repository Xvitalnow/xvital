import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    gender: {
      type: String,
      required: true,
    },

    weight: {
      type: Number,
      default: 0,
    },

    height: {
      type: Number,
      default: 0,
    },

    age: {
      type: Number,
      default: 0,
    },

    healthScore: {
      type: Number,
      default: 0,
    },

    healthLabel: {
      type: String,
      default: "",
    },

    bodyInsights: {
      type: String,
      default: "",
    },

    whyThisHappens: {
      type: String,
      default: "",
    },

    possibleOutcomes: {
      type: String,
      default: "",
    },

    foodRestrictions: {
      type: [String],
      default: [],
    },
    questionnaireAnswers: {
      type: Object,
      default: {},
    },

    questionnaireSubAnswers: {
      type: Object,
      default: {},
    },

    questionnaireExtraInputs: {
      type: Object,
      default: {},
    },

    // booking later
    date: {
      type: Date,
      default: null,
    },

    time: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "completed",
        "cancelled",
        "rescheduled",
      ],
      default: "draft",
    },

    zohoContactId: {
      type: String,
      default: null,
    },
    zohoTaskId: {
      type: String,
      default: "",
    },

    consultationFeePaid: {
      type: Boolean,
      default: false,
    },
    zohoMeetingId: {
      type: String,
      default: "",
    },

    consultationAmount: {
      type: Number,
      default: 0,
    },

    razorpay_order_id: {
      type: String,
      default: "",
    },

    razorpay_payment_id: {
      type: String,
      default: "",
    },

    whatsappEligible: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Consultation = mongoose.model(
  "Consultation",
  consultationSchema
);