import { NextFunction, Request, Response } from "express";
import UserService from "../service/user";
import { constructResponseBody } from "../utils/constructResponseBody";
import WebhookService from "../service/webhook";

const userService = new UserService();
const webhookService = new WebhookService();

export const authenticateUser: (req: any, res: any, next: any) => void = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await userService.authenticateUser(email?.toLowerCase());
    console.log("User authenticated:", user);
    return res.status(200).json(constructResponseBody(user));
  } catch (error) {
    next(error);
  }
};

export const verifyOtp: (req: any, res: any, next: any) => void = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    const user = await userService.verifyOtp(email?.toLowerCase(), otp);
    return res.status(200).json(constructResponseBody(user));
  } catch (error) {
    next(error);
  }
};

export const updateOnboardingInformation: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const onboardingData = req.body;
    const updatedUser = await userService.updateOnboardingInformation(
      req.user.id,
      onboardingData
    );
    return res.status(200).json(constructResponseBody(updatedUser));
  } catch (error) {
    next(error);
  }
};

export const getAllInstitution: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const institutions = await userService.getAllInstitutions();
    return res.status(200).json(constructResponseBody(institutions));
  } catch (error) {
    next(error);
  }
};

export const initiateConnection: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { institutionId, selectedAuthMethod } = req.body;
    const connectionData = await userService.initiateConnection(
      req.user.id,
      institutionId,
      selectedAuthMethod
    );
    return res.status(200).json(constructResponseBody(connectionData));
  } catch (error) {
    next(error);
  }
};

export const exchangeCodeForToken: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.body;
    const tokenData = await userService.exchangeCodeForToken(req.user.id, code);
    return res.status(200).json(constructResponseBody(tokenData));
  } catch (error) {
    next(error);
  }
};

export const processWebhookEvent: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = req.body;
    await webhookService.handleMonoWebhook(event);
    return res
      .status(200)
      .json(
        constructResponseBody({ message: "Webhook processed successfully" })
      );
  } catch (error) {
    next(error);
  }
};

export const initiatePlaidLinkToken: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const linkToken = await userService.initiatePlaidLinkToken(req.user.id);
    return res.status(200).json(constructResponseBody(linkToken));
  } catch (error) {
    next(error);
  }
};

export const syncRealTimeTransactions: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await userService.getRealTimeTransactions(req.user.id);
    return res.status(200).json(constructResponseBody(transactions));
  } catch (error) {
    next(error);
  }
};

export const syncTransactionByDate: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.body;
    const transactions = await userService.syncTransactions(
      req.user.id,
      startDate,
      endDate
    );
    return res.status(200).json(constructResponseBody(transactions));
  } catch (error) {
    next(error);
  }
};

export const getAllTransactions: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await userService.getAllTransactions(req.user.id);
    return res.status(200).json(constructResponseBody(transactions));
  } catch (error) {
    next(error);
  }
};

export const updatePushNotificationToken: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pushNotificationToken } = req.body;
    const updatedUser = await userService.updatePushNotificationToken(
      req.user.id,
      pushNotificationToken
    );
    return res.status(200).json(constructResponseBody(updatedUser));
  } catch (error) {
    next(error);
  }
};

export const getTodaysTransactions: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await userService.getCurrentDayTransactions(
      req.user.id
    );
    return res.status(200).json(constructResponseBody(transactions));
  } catch (error) {
    next(error);
  }
};

export const updateTransaction: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { transactionId, updateData } = req.body;
    const updatedTransaction = await userService.updateTransaction(
      transactionId,
      updateData
    );
    return res.status(200).json(constructResponseBody(updatedTransaction));
  } catch (error) {
    next(error);
  }
};


export const getUserDetails: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userDetails = await userService.getUserDetails(req.user.id);
    return res.status(200).json(constructResponseBody(userDetails));
  } catch (error) {
    next(error);
  }
};