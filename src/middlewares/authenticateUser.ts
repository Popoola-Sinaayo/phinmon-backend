
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
export const authenticateUserToken: any = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    } else {
      const authorization = req.headers.authorization;
        const token = authorization.split(" ")[1];
 
        const decoded = jwt.verify(token, config().JWT_SECRET) as any;
    
        req.user = decoded;
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }
};
