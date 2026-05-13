import express from "express";

import {
  sendLeadOTP,
  verifyLeadOTP,
} from "../controllers/leads.controllers.js";



const router = express.Router();

router.post("/leads/send-otp", sendLeadOTP);
router.post("/leads/verify", verifyLeadOTP);



export default router;