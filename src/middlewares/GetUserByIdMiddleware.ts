import { errorResponse } from "@/Utils/errorRes";
import { User } from "@/models/User/User";
import { NextFunction, Request, Response } from "express";

export async function CheckUserIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params;
  if (!userId) return res.status(400).json(errorResponse());

  const userDoc = await User.findById(userId).populate("role").populate("tel").populate("email");
  if (!userDoc) return res.status(404).json(errorResponse());

  next();
}
