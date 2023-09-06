import { errorResponse } from "@/Utils/errorRes";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import { Room } from "@/models/Room/Room";
import { TRole } from "@/models/User/Role";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function PermissionAdmin(req: RequestAuthenticate, res: Response, next: NextFunction) {
  const { roleTitle } = req;

  const acceptRoles: (typeof roleTitle)[] = ["admin"];
  if (acceptRoles.includes(roleTitle)) return next();

  return res.status(StatusCodes.FORBIDDEN).json(errorResponse(`Bạn không có quyền làm việc này.`));
}

export async function PermissionAdminLvl2(req: RequestAuthenticate, res: Response, next: NextFunction) {
  const { roleTitle } = req;

  const acceptRoles: (typeof roleTitle)[] = ["admin", "admin_lvl_2"];
  if (acceptRoles.includes(roleTitle)) return next();

  return res.status(StatusCodes.FORBIDDEN).json(errorResponse(`Bạn không có quyền làm việc này.`));
}

export async function PermissionPlaceOwner(req: RequestAuthenticate, res: Response, next: NextFunction) {
  const { roleTitle } = req;

  const acceptRoles: (typeof roleTitle)[] = ["admin", "admin_lvl_2", "owner"];
  if (acceptRoles.includes(roleTitle)) return next();

  return res.status(StatusCodes.FORBIDDEN).json(errorResponse(`Bạn không có quyền làm việc này.`));
}

export async function PermissionUser(req: RequestAuthenticate, res: Response, next: NextFunction) {
  const { roleTitle } = req;

  const acceptRoles: (typeof roleTitle)[] = ["admin", "admin_lvl_2", "user"];
  if (acceptRoles.includes(roleTitle)) return next();

  return res.status(StatusCodes.FORBIDDEN).json(errorResponse(`Bạn không có quyền làm việc này.`));
}

export async function PermissionPlaceOwnerAndUser(req: RequestAuthenticate, res: Response, next: NextFunction) {
  const { roleTitle } = req;

  const acceptRoles: (typeof roleTitle)[] = ["admin", "admin_lvl_2", "owner", "user"];
  if (acceptRoles.includes(roleTitle)) return next();

  return res.status(StatusCodes.FORBIDDEN).json(errorResponse("Bạn không có quyền làm việc này."));
}
export const PermissionOf =
  (...role: TRole[]) =>
  async (req: RequestAuthenticate, res: Response, next: NextFunction) => {
    const { roleTitle } = req;

    const acceptRoles: (typeof roleTitle)[] = [...role, "admin"];
    if (acceptRoles.includes(roleTitle)) return next();

    return res.status(StatusCodes.FORBIDDEN).json(errorResponse("Bạn không có quyền làm việc này."));
  };

export async function UserSelfChangeOrAdminMiddleware(req: RequestAuthenticate, res: Response, next: NextFunction) {
  try {
    const { userId, roomId } = req.params;
    const { user, roleTitle } = req;

    const acceptRoles: (typeof roleTitle)[] = ["admin", "admin_lvl_2"];
    if (acceptRoles.includes(roleTitle)) return next();

    let uId = userId;
    if (roomId) {
      let rId = await Room.findById(roomId).populate("owner");
      if (rId) {
        uId = rId.owner._id.toString();
      }
    }
    if (user!._id.toString() === uId) return next();

    return res.status(StatusCodes.FORBIDDEN).json(errorResponse("Bạn không có quyền làm việc này."));
  } catch (error: any) {
    return res.status(StatusCodes.FORBIDDEN).json(errorResponse(error.toString()));
  }
}
