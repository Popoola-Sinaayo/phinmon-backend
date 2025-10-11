import { NextFunction, Request, Response } from "express";
import ChatWithAIService from "../service/chatWithAI";
import { constructResponseBody } from "../utils/constructResponseBody";

const chatWithAIService = new ChatWithAIService();

export const chatWithAI: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question } = req.body;
    
    if (!question || question.trim() === "") {
      return res.status(400).json(
        constructResponseBody(null, "Question is required", false)
      );
    }

    const response = await chatWithAIService.chatWithAI(req.user.id, question);
    return res.status(200).json(constructResponseBody(response));
  } catch (error) {
    next(error);
  }
};
