import express from 'express';
import {
  authenticateUser,
  exchangeCodeForToken,
  getAllInstitution,
  getAllTransactions,
  getMySpendingClass,
  getTodaysTransactions,
  getUserDetails,
  initiateConnection,
  initiatePlaidLinkToken,
  processWebhookEvent,
  syncRealTimeTransactions,
  syncTransactionByDate,
  updateOnboardingInformation,
  updatePushNotificationToken,
  updateTransaction,
  verifyOtp,
} from "../controller/user";
import { authenticateUserToken } from "../middlewares/authenticateUser";

const router = express.Router();

router.post("/authenticate", authenticateUser);
router.post("/verify-otp", verifyOtp);
router.post("/onboarding", authenticateUserToken, updateOnboardingInformation);
router.get("/institutions", authenticateUserToken, getAllInstitution);
router.post("/initiate-connection", authenticateUserToken, initiateConnection);
router.post("/monolink-token", authenticateUserToken, exchangeCodeForToken);
router.get(
  "/initiate-plaid-connection",
  authenticateUserToken,
  initiatePlaidLinkToken
);
router.get("/transactions", authenticateUserToken, getAllTransactions);
router.get("/sync/realtime", authenticateUserToken, syncRealTimeTransactions);
router.get("/sync/datetime", authenticateUserToken, syncTransactionByDate);
router.post(
  "/push/notifications",
  authenticateUserToken,
  updatePushNotificationToken
);
router.post("/transaction/update", authenticateUserToken, updateTransaction);
router.get("/transaction/today", authenticateUserToken, getTodaysTransactions);
router.post("/webhook", processWebhookEvent);
router.get("/class", authenticateUserToken, getMySpendingClass);
router.get("/me", authenticateUserToken, getUserDetails);


export default router;