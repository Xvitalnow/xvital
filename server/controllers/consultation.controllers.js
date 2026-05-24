// ============================================
// controllers/consultation.controllers.js
// FINAL FULL VERSION
// draft -> pending -> cancelled -> rescheduled -> completed
// ============================================

import { Consultation } from "../models/consultation.models.js";

import {
  createOrUpdateZohoContact,
  searchZohoContactByEmail,
  createOrUpdateZohoTask,
} from "../services/zoho.services.js";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../services/payment.services.js";

import { generateReceiptPDF } from "../services/reciept.services.js";
import { sendEmail } from "../services/email.services.js";
import fs from "fs";


// ============================================
// GET BOOKED SLOTS
// GET /consultations/slots?date=YYYY-MM-DD
// ============================================
export const getBookedSlots = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const bookings = await Consultation.find({
      date: {
        $gte: selectedDate,
        $lt: nextDay,
      },
      status: {
        $in: [
          "pending",
          "rescheduled",
          "completed",
        ],
      },
    });

    const slots = bookings
      .map((item) => item.time)
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      slots,
    });

  } catch (error) {
    console.error("Slots Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch slots",
    });
  }
};


// ============================================
// CREATE / BOOK CONSULTATION
// only needs email + date + time
// ============================================
export const createConsultationOrder = async (req, res) => {
  try {
    const order = await createRazorpayOrder(999);

    return res.status(200).json({
      success: true,
      amount: 999,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

export const verifyConsultationPaymentAndBook = async (req, res) => {
  try {
    const {
      email,
      date,
      time,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const normalizedEmail =
      email?.trim()?.toLowerCase();

    const valid = verifyRazorpayPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const slotExists =
      await Consultation.findOne({
        date,
        time,
        status: {
          $in: [
            "pending",
            "rescheduled",
            "completed",
          ],
        },
        email: { $ne: normalizedEmail },
      });

    if (slotExists) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked",
      });
    }

    const consultation =
      await Consultation.findOne({
        email: normalizedEmail,
      });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    consultation.date = date;
    consultation.time = time;
    consultation.status = "pending";

    consultation.consultationFeePaid = true;
    consultation.consultationAmount = 999;

    consultation.razorpay_order_id =
      razorpay_order_id;

    consultation.razorpay_payment_id =
      razorpay_payment_id;

    consultation.whatsappEligible = true;

    await consultation.save();

    try {
      const pdfPath = await generateReceiptPDF({
        name: consultation.name,
        email: consultation.email,
        date: consultation.date,
        time: consultation.time,
        paymentId: razorpay_payment_id,
      });

      await sendEmail(
        "XVITAL BOOKING <bookings@xvital.in>",
        consultation.email,
        "Consultation Booked Successfully",
        {
          name: consultation.name,
          date: consultation.date,
          time: consultation.time,
          type: "booked",
          message: "Your consultation has been booked successfully. We will connect with you at your scheduled time.",
        },
        [pdfPath]
      );

      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);

    } catch (err) {
      console.error("PDF/Email error:", err);
    }

    try {

      await createOrUpdateZohoContact({
        ...consultation.toObject(),
        status: "pending",
      });
      try {

        await createOrUpdateZohoTask({
          ...consultation.toObject(),
          status: "pending",
        });

      } catch (err) {

        console.error(
          "ZOHO TASK ERROR:",
          err
        );

      }


    } catch (err) {

      console.error(
        "ZOHO UPDATE ERROR:",
        err
      );

    }

    return res.status(200).json({
      success: true,
      whatsappEligible: true,
      whatsappLink:
        "https://chat.whatsapp.com/IaHhhhhhf86XAcfe2hYBf4tyyA5g?s=sh&p=i&mlu=0",
      data: consultation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Booking failed",
    });
  }
};


// ============================================
// GET CONSULTATION / REPORT BY EMAIL
// used for resume previous report
// ============================================
export const getConsultationsByEmail = async (
  req,
  res
) => {
  try {
    const email =
      req.query.email?.trim()?.toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const localConsultation =
      await Consultation.findOne({
        email,
      });

    if (localConsultation) {
      return res.status(200).json({
        success: true,
        consultation: localConsultation,
      });
    }

    // fallback Zoho
    const contact =
      await searchZohoContactByEmail(email);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "No report found",
      });
    }

    let parsed = {};

    try {
      parsed = contact.Description
        ? JSON.parse(contact.Description)
        : {};
    } catch { }

    return res.status(200).json({
      success: true,
      consultation: {
        name: contact.First_Name || "",
        email: contact.Email || "",
        phone: contact.Phone || "",
        gender: contact.Gender || "",

        ...parsed,

        status:
          contact.Lead_Source ||
          "draft",
      },
    });

  } catch (error) {
    console.error("Fetch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch report",
    });
  }
};


// ============================================
// CANCEL CONSULTATION
// ============================================
export const cancelConsultation = async (
  req,
  res
) => {
  try {
    const email =
      req.body.email?.trim()?.toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const consultation =
      await Consultation.findOne({
        email,
      });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    consultation.status = "cancelled";

    await consultation.save();

    try {

      await createOrUpdateZohoContact({
        ...consultation.toObject(),
        status: "cancelled",
      });

      const task =
        await createOrUpdateZohoTask({
          ...consultation.toObject(),
          status: "pending",
        });

      if (
        task?.taskId &&
        !consultation.zohoTaskId
      ) {

        consultation.zohoTaskId =
          task.taskId;

        await consultation.save();
      }

    } catch (err) {

      console.error(
        "ZOHO UPDATE ERROR:",
        err
      );

    }
    // send cancellation email
    await sendEmail(
      "XVITAL CANCELLATION <bookings@xvital.in>",
      consultation.email,
      "Consultation Cancelled",
      {
        name: consultation.name,
        date: consultation.date,
        time: consultation.time,
        type: "cancelled",
        message: "Your consultation has been cancelled. If you have any questions, please contact us.",
      }
    );

    return res.status(200).json({
      success: true,
      consultation,
    });

  } catch (error) {
    console.error("Cancel Error:", error);

    return res.status(500).json({
      success: false,
      message: "Cancellation failed",
    });
  }
};


// ============================================
// RESCHEDULE CONSULTATION
// ============================================
export const rescheduleConsultation = async (
  req,
  res
) => {
  try {
    const email =
      req.body.email?.trim()?.toLowerCase();

    const { date, time } = req.body;

    if (!email || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Email, date and time required",
      });
    }

    const slotExists =
      await Consultation.findOne({
        date,
        time,
        status: {
          $in: [
            "pending",
            "rescheduled",
            "completed",
          ],
        },
        email: { $ne: email },
      });

    if (slotExists) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked",
      });
    }

    const consultation =
      await Consultation.findOne({
        email,
      });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    consultation.date = date;
    consultation.time = time;
    consultation.status = "rescheduled";

    await consultation.save();

    try {

      await createOrUpdateZohoContact({
        ...consultation.toObject(),
        status: "rescheduled",
      });
      try {

        await createOrUpdateZohoTask({
          ...consultation.toObject(),
          status: "rescheduled",
        });

      } catch (err) {

        console.error(
          "ZOHO TASK ERROR:",
          err
        );

      }

    } catch (err) {

      console.error(
        "ZOHO UPDATE ERROR:",
        err
      );

    }

    // send rescheduling email
    await sendEmail(
      "XVITAL RESCHEDULE <bookings@xvital.in>",
      consultation.email,
      "Consultation Rescheduled",
      {
        name: consultation.name,
        date: consultation.date,
        time: consultation.time,
        type: "rescheduled",
        message: "Your consultation has been rescheduled. If you have any questions, please contact us.",
      }
    );

    return res.status(200).json({
      success: true,
      consultation,
    });

  } catch (error) {
    console.error(
      "Reschedule Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Reschedule failed",
    });
  }
};


// ============================================
// DELETE CONSULTATION
// ============================================
export const deleteConsultation = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const consultation =
      await Consultation.findById(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    await Consultation.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (error) {
    console.error("Delete Error:", error);

    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

// delete all consultations from mongodb
export const deleteAllConsultations = async (
  req,
  res
) => {
  try {
    await Consultation.deleteMany({});

    return res.status(200).json({
      success: true,
      message: "All consultations deleted",
    });

  }
  catch (error) {
    console.error("Delete All Error:", error);

    return res.status(500).json({
      success: false,
      message: "Delete all failed",
    });
  }
}

// get all consultation from mongodb
export const getAllConsultations = async (
  req,
  res
) => {
  try {
    const consultations =
      await Consultation.find({});

    return res.status(200).json({
      success: true,
      consultations,
    });

  }
  catch (error) {
    console.error("Get All Error:", error);

    return res.status(500).json({
      success: false,
      message: "Get all failed",
    });
  }
}