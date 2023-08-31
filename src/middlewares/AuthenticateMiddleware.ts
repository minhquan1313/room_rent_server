import { errorResponse } from "@/Utils/errorRes";
import { LoginToken } from "@/models/User/LoginToken";
import { Role, TRole } from "@/models/User/Role";
import { TUserDocument, User } from "@/models/User/User";
import LoginTokenService from "@/services/LoginTokenService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export type RequestAuthenticate = Request & {
  user?: TUserDocument;
  roleTitle?: TRole;
};
export async function AuthenticateMiddleware(req: RequestAuthenticate, res: Response, next: NextFunction) {
  try {
    const bearerToken = req.headers.authorization;
    console.log(`🚀 ~ AuthenticateMiddleware ~ bearerToken:`, bearerToken);

    if (!bearerToken) throw new Error(`Unauthorized`);

    const [type, token] = bearerToken.split(" ");
    if (type !== "Bearer") throw new Error(`Unauthorized`);

    const loginToken = await LoginToken.findOne({ token });
    console.log(`🚀 ~ AuthenticateMiddleware ~ loginToken:`, loginToken);

    if (!loginToken || loginToken.user === null) throw new Error(`Unauthorized`);

    const user = await User.findOne(loginToken.user);
    console.log(`🚀 ~ AuthenticateMiddleware ~ loginToken.user:`, loginToken.user);

    console.log(`🚀 ~ AuthenticateMiddleware ~ user:`, user);

    const now = new Date();
    if (!user || !user.role || user.disabled || loginToken.expire.getTime() < now.getTime()) {
      // Token het han|user da bi vo hieu hoa, dang nhap lai
      await loginToken.deleteOne();

      throw new Error(`Unauthorized`);
    }

    // extendsTime background
    LoginTokenService.extendsTime(loginToken.token);

    const role = await Role.findById(user.role);

    // authorized success
    req.user = user;
    // if (user.role.toString() === (await Role.getRoleAdmin())?._id.toString()) req.isAdmin = true;
    req.roleTitle = role?.title as any;
    next();
  } catch (error: any) {
    // "Unauthorized"
    return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse(error.toString()));
  }
}
