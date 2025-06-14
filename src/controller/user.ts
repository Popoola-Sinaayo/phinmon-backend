import { NextFunction, Request, Response } from "express";
import UserService from "../service/user";
import { constructResponseBody } from "../utils/constructResponseBody";

const userService = new UserService();

export const authenticateUser: (req: any, res: any, next: any) => void = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await userService.authenticateUser(email);
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
    const user = await userService.verifyOtp(email, otp);
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
      const tokenData = await userService.exchangeCodeForToken(
        req.user.id,
        code
      );
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
      await userService.handleWebhookEvent(event);
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