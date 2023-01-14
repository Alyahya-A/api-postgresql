import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../consts/statusCodes";
import jwt from "jsonwebtoken";
import config from "../config/config";

export const checkAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(StatusCode.unauthorized).json();
  }

  try {
    const decoded = jwt.verify(token!, config.Secret);

    next();
  } catch (err) {
    res.status(StatusCode.unauthorized).json();
  }
};
