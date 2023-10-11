import RoomController from "@/controllers/apiV1/RoomController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { UserSelfChangeOrAdminMiddleware } from "@/middlewares/PermissionMiddleware";
import { UploaderMiddlewareWithJson } from "@/middlewares/UploaderMiddleware";
import { ValidateHasUploadFilesMiddleware } from "@/middlewares/ValidateMiddleware";
import { validateAddRoom, validateEditRoom } from "@/models/Room/Room";
import express from "express";

// /api/v1/rooms
const router = express.Router();

router.get(
  //
  "/:id",
  RoomController.getSingle
);

router.get(
  //
  "/",
  RoomController.getOrSearch
);

router.post(
  //
  "/",
  AuthenticateMiddleware,
  UploaderMiddlewareWithJson("any"),
  validateAddRoom(),
  ValidateHasUploadFilesMiddleware,
  RoomController.postAddRoom
);

router.patch(
  //
  "/:roomId",
  AuthenticateMiddleware,
  UserSelfChangeOrAdminMiddleware,
  UploaderMiddlewareWithJson("any"),
  validateEditRoom(),
  ValidateHasUploadFilesMiddleware,
  RoomController.patchEditRoom
);

router.delete(
  //
  "/:roomId",
  AuthenticateMiddleware,
  UserSelfChangeOrAdminMiddleware,
  RoomController.deleteRoom
);

export { router as roomV1Router };
