import { errorResponse } from "@/Utils/errorRes";
import { LoginToken } from "@/models/User/LoginToken";
import { User } from "@/models/User/User";
import { NextFunction, Request, Response } from "express";

export type RequestAuthenticateMiddleware = Request & {
  authorizedUser?: Awaited<ReturnType<typeof AuthenticateMiddleware>>;
};

export async function AuthenticateMiddleware(req: RequestAuthenticateMiddleware, res: Response, next: NextFunction) {
  const { user_token }: { user_token?: string } = req.cookies;
  console.log("🚀 -----------------------------------------------------🚀");
  console.log("🚀 ~ AuthenticateMiddleware ~ user_token:", user_token);
  console.log("🚀 -----------------------------------------------------🚀");

  if (!user_token) return res.status(401).json(errorResponse());

  const loginToken = await LoginToken.findOne({ token: user_token });
  if (!loginToken) return res.status(401).json(errorResponse());

  const user = await User.findById(loginToken.user);
  if (!user) return res.status(404).json(errorResponse());

  // authorized success
  req.authorizedUser = user;

  next();
  return user;
}
