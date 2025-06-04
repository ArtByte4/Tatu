import { SECRET_JWT_KEY } from "../../../config.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


export interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies?.access_token;

  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, SECRET_JWT_KEY, (err: any, decoded: any) => {
    if (err) {
      res.sendStatus(403);
      return;
    }

    req.user = decoded;
    next();
  });
};