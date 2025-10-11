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

export const getChatHistory: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const chatHistory = await chatWithAIService.getChatHistory(
      req.user.id,
      limit
    );
    return res.status(200).json(constructResponseBody(chatHistory));
  } catch (error) {
    next(error);
  }
};

export const deleteChat: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId } = req.params;
    const deletedChat = await chatWithAIService.deleteChat(req.user.id, chatId);
    return res.status(200).json(constructResponseBody(deletedChat));
  } catch (error) {
    next(error);
  }
};
