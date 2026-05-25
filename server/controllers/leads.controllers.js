import Lead from "../models/leads.models.js";
import { Consultation } from "../models/consultation.models.js";

import {
  createOrUpdateZohoContact,
  createZohoLead
} from "../services/zoho.services.js";

import {
  generateOTP,
  sendEmail,
} from "../services/email.services.js";


// ============================================
// SEND OTP
// ============================================
export const sendLeadOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const otp = generateOTP();

    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    let lead = await Lead.findOne({
      email: normalizedEmail,
    });

    if (lead) {
      lead.otp = otp;
      lead.otpExpiresAt = expiresAt;
      lead.isEmailVerified = false;

      await lead.save();
    } else {
      lead = await Lead.create({
        name: "Pending",
        email: normalizedEmail,
        phone: "Pending",
        gender: "male",
        otp,
        otpExpiresAt: expiresAt,
      });
    }

    await sendEmail(
      "noreply XVITAL <noreply@xvital.in>",
      normalizedEmail,
      "Your XVITAL OTP Code will expire in 5 minutes",
      `${otp}.`
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};


// ============================================
// VERIFY OTP
// ============================================
export const verifyLeadOTP = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      otp,

      weight,
      height,
      age,

      healthScore,
      healthLabel,
      bodyInsights,
      whyThisHappens,
      possibleOutcomes,
      foodRestrictions,

      questionnaireAnswers,
      questionnaireSubAnswers,
      questionnaireExtraInputs,
    } = req.body;

    const normalizedEmail =
      email.trim().toLowerCase();

    const lead = await Lead.findOne({
      email: normalizedEmail,
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (lead.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (
      !lead.otpExpiresAt ||
      new Date() > lead.otpExpiresAt
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // =====================================
    // SAVE LEAD
    // =====================================
    lead.name = name.trim();
    lead.phone = phone.trim();
    lead.gender = gender;

    lead.isEmailVerified = true;
    lead.otp = null;
    lead.otpExpiresAt = null;

    await lead.save();

    // =====================================
    // SAVE CONSULTATION DRAFT
    // =====================================
    let consultation =
  await Consultation.findOne({
    email: normalizedEmail,
  });

// =====================================
// UPDATE EXISTING USER
// =====================================
if (consultation) {

  // ONLY UPDATE HEALTH DATA
  consultation.name = name.trim();
  consultation.phone = phone.trim();
  consultation.gender = gender;

  consultation.weight =
    Number(weight || 0);

  consultation.height =
    Number(height || 0);

  consultation.age =
    Number(age || 0);

  consultation.healthScore =
    healthScore;

  consultation.healthLabel =
    healthLabel;

  consultation.bodyInsights =
    bodyInsights;

  consultation.whyThisHappens =
    whyThisHappens;

  consultation.possibleOutcomes =
    possibleOutcomes;

  consultation.foodRestrictions =
    Array.isArray(foodRestrictions)
      ? foodRestrictions
      : foodRestrictions
      ? [foodRestrictions]
      : [];

  consultation.questionnaireAnswers =
    questionnaireAnswers || {};

  consultation.questionnaireSubAnswers =
    questionnaireSubAnswers || {};

  consultation.questionnaireExtraInputs =
    questionnaireExtraInputs || {};

  consultation.lastAssessmentAt =
    new Date();

  consultation.assessmentCount =
    (consultation.assessmentCount || 0) + 1;

  // ❌ DO NOT TOUCH:
  // status
  // booking
  // payment
  // consultation schedule

  await consultation.save();

} else {

  // =====================================
  // CREATE NEW USER
  // =====================================
  consultation =
    await Consultation.create({
      name: name.trim(),

      phone: phone.trim(),

      email: normalizedEmail,

      gender,

      weight:
        Number(weight || 0),

      height:
        Number(height || 0),

      age:
        Number(age || 0),

      healthScore,

      healthLabel,

      bodyInsights,

      whyThisHappens,

      possibleOutcomes,

      foodRestrictions:
        Array.isArray(foodRestrictions)
          ? foodRestrictions
          : foodRestrictions
          ? [foodRestrictions]
          : [],

      questionnaireAnswers:
        questionnaireAnswers || {},

      questionnaireSubAnswers:
        questionnaireSubAnswers || {},

      questionnaireExtraInputs:
        questionnaireExtraInputs || {},

      status: consultation?.status || "draft",

      assessmentCount: 1,

      lastAssessmentAt:
        new Date(),
    });
}
      


    // ===============================
    // SAVE ZOHO LEAD
    // ===============================
    await createZohoLead({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      gender,
    });



    // =====================================
    // SAVE ZOHO CONTACT
    // =====================================

    const zoho =
      await createOrUpdateZohoContact({
        name: name.trim(),
        phone: phone.trim(),
        email: normalizedEmail,
        gender,

        weight,
        height,
        age,

        healthScore,
        healthLabel,
        bodyInsights,
        whyThisHappens,
        possibleOutcomes,
        foodRestrictions,

        questionnaireAnswers: questionnaireAnswers || {},
        questionnaireSubAnswers: questionnaireSubAnswers || {},
        questionnaireExtraInputs: questionnaireExtraInputs || {},

        status: consultation?.status || "draft",
      });

    if (zoho?.contact) {
      consultation.zohoContactId =
        zoho.contact;

      await consultation.save();
    }

    return res.status(200).json({
      success: true,
      message: "Verified successfully",
      consultation: {
        status: consultation.status,
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};

// get all leads
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
}