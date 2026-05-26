import express from "express";

import {
  sendLeadOTP,
  verifyLeadOTP,
  getAllLeads,
  deleteAllLeads,
} from "../controllers/leads.controllers.js";



const router = express.Router();

router.post("/leads/send-otp", sendLeadOTP);
router.post("/leads/verify", verifyLeadOTP);
router.get("/leads", getAllLeads);
// router.get("/leads/delete", deleteAllLeads); // for testing purposes only



export default router;