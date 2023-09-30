import { errorResponse } from "@/Utils/errorRes";
import { LoginToken } from "@/models/User/LoginToken";
import { RoleDocument, TRole } from "@/models/User/Role";
import { User, UserDocument } from "@/models/User/User";
import LoginTokenService from "@/services/LoginTokenService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export type RequestAuthenticate = Request & {
  user?: UserDocument;
  roleTitle?: TRole;
  token?: string;
};

/**
 * Must auth
 */
export async function AuthenticateMiddleware(req: RequestAuthenticate, res: Response, next: NextFunction) {
  if (await Auth(req, res, next)) return next();

  res.status(StatusCodes.UNAUTHORIZED).json(errorResponse(`Unauthorized`));
}

/**
 * If user auth then req will have user
 * and roleTitle for the next method
 */
export async function IsAuthenticatedMiddleware(req: RequestAuthenticate, res: Response, next: NextFunction) {
  await Auth(req, res, next);

  next();
}

async function Auth(req: RequestAuthenticate, res: Response, next: NextFunction) {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) throw new Error();

    const [type, token] = bearerToken.split(" ");
    if (type !== "Bearer") throw new Error();

    const loginToken = await LoginToken.findOne({ token });
    if (!loginToken || loginToken.user === null) throw new Error();

    const user = await User.findOne(loginToken.user).populate("role");
    const now = new Date();

    if (!user || !user.role || user.disabled || loginToken.expire.getTime() < now.getTime()) {
      // Token het han|user da bi vo hieu hoa, dang nhap lai
      await loginToken.deleteOne();
      throw new Error();
    }

    // authorized success

    // extendsTime background
    LoginTokenService.extendsTime(loginToken.token);
    const role = user.role as unknown as RoleDocument;

    req.user = user;
    req.roleTitle = role?.title;
    req.token = token;
    return true;
  } catch (error: any) {
    // "Unauthorized"
    return false;
  }
}
