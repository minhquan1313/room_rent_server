import { errorResponse } from "@/Utils/errorRes";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import { Room } from "@/models/Room/Room";
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

export async function UserSelfChangeOrAdminMiddleware(req: RequestAuthenticate, res: Response, next: NextFunction) {
  const { userId } = req.params;
  const { user, roleTitle } = req;

  const acceptRoles: (typeof roleTitle)[] = ["admin", "admin_lvl_2"];
  if (acceptRoles.includes(roleTitle) || user!._id.toString() === userId) return next();

  return res.status(StatusCodes.FORBIDDEN).json(errorResponse("Bạn không có quyền làm việc này."));
}
export async function UserSelfChangeOrAdminRoomMiddleware(req: RequestAuthenticate, res: Response, next: NextFunction) {
  const { roomId } = req.params;
  const { user, roleTitle } = req;

  const room = await Room.findById(roomId);
  if (!room) return res.status(StatusCodes.NOT_FOUND).json(errorResponse("Không tìm thấy phòng"));

  const userId = room.owner.toString();

  const acceptRoles: (typeof roleTitle)[] = ["admin", "admin_lvl_2"];
  if (acceptRoles.includes(roleTitle) || user!._id.toString() === userId) return next();

  return res.status(StatusCodes.FORBIDDEN).json(errorResponse("Bạn không có quyền làm việc này."));
}
