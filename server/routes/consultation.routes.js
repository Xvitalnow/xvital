import express from "express";
import {
  createConsultationOrder,
  verifyConsultationPaymentAndBook,
  getBookedSlots,
  getConsultationsByEmail,
  cancelConsultation,
  rescheduleConsultation,
  deleteAllConsultations,
} from "../controllers/consultation.controllers.js";

const router = express.Router();

router.post("/consultations/create-order", createConsultationOrder);
router.post("/consultations/verify-payment", verifyConsultationPaymentAndBook);
router.get("/consultations", getConsultationsByEmail);
router.get("/consultations/slots", getBookedSlots);
router.patch("/consultations/cancel", cancelConsultation);
router.patch("/consultations/reschedule", rescheduleConsultation);

// delete all consultations -
router.get("/consultations/delete", deleteAllConsultations);

export default router;