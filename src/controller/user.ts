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