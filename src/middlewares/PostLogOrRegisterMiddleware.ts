import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";

export type RequestPostLogOrRegisterMiddleware = Request & {};

export async function PostLogOrRegisterMiddleware(req: RequestPostLogOrRegisterMiddleware, res: Response, next: NextFunction) {
  next();
}
