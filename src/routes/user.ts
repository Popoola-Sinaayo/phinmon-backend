import express from 'express';
import {
  authenticateUser,
  getAllInstitution,
  initiateConnection,
  initiatePlaidLinkToken,
  processWebhookEvent,
  updateOnboardingInformation,
  verifyOtp,
} from "../controller/user";
import { authenticateUserToken } from "../middlewares/authenticateUser";

const router = express.Router();

router.post("/authenticate", authenticateUser);
router.post("/verify-otp", verifyOtp);
router.post("/onboarding", authenticateUserToken, updateOnboardingInformation);
router.get("/institutions", authenticateUserToken, getAllInstitution);
router.post("/initiate-connection", authenticateUserToken, initiateConnection);
router.get(
  "/initiate-plaid-connection",
  authenticateUserToken,
  initiatePlaidLinkToken
);
router.post("/webhook", processWebhookEvent);


export default router;