import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

const errHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  console.log(err.message);
  return res
    .status(err?.code ?? 400)
    .json({ success: false, message: err?.message });
};

export default errHandler;
