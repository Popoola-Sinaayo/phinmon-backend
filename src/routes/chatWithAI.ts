import express from 'express';
import { chatWithAI } from "../controller/chatWithAI";
import { authenticateUserToken } from "../middlewares/authenticateUser";

const router = express.Router();

router.post("/chat", authenticateUserToken, chatWithAI);

export default router;
