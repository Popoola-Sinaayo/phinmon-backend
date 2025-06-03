import express from 'express';
import { authenticateUser, updateOnboardingInformation, verifyOtp } from '../controller/user';
import { authenticateUserToken } from '../middlewares/authenticateUser';

const router = express.Router();

router.post("/authenticate", authenticateUser)
router.post("/verify-otp", verifyOtp);
router.post("/onboarding", authenticateUserToken, updateOnboardingInformation);


export default router;