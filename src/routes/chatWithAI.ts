import express from 'express';
import {
  chatWithAI,
  getChatHistory,
  deleteChat,
} from "../controller/chatWithAI";
import { authenticateUserToken } from "../middlewares/authenticateUser";

const router = express.Router();

router.post("/chat", authenticateUserToken, chatWithAI);
router.get("/history", authenticateUserToken, getChatHistory);
router.delete("/chat/:chatId", authenticateUserToken, deleteChat);

export default router;
