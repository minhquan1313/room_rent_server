import RoomController from "@/controllers/apiV1/RoomController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { CachedMiddleware } from "@/middlewares/CachedMiddleware";
import { UserSelfChangeOrAdminMiddleware } from "@/middlewares/PermissionMiddleware";
import { UploaderMiddlewareWithJson } from "@/middlewares/UploaderMiddleware";
import { ValidateHasUploadFilesMiddleware } from "@/middlewares/ValidateMiddleware";
import { validateAddRoom, validateEditRoom } from "@/models/Room/Room";
import express from "express";

// /api/v1/rooms
const router = express.Router();

router.get(
  "/:id",
  //
  CachedMiddleware(),
  RoomController.getSingle
);
router.get(
  "/",
  //
  CachedMiddleware(),
  RoomController.getOrSearch
);

// router.post(
//   "/image/:roomId",
//   //
//   AuthenticateMiddleware,
//   UserSelfChangeOrAdminMiddleware,
//   UploaderMiddlewareWithJson("array", "images"),
//   validateEditRoom(),
//   ValidateHasUploadFilesMiddleware,
//   RoomController.postNewImagesToRoom
// );

router.post(
  "/",
  //
  AuthenticateMiddleware,
  UploaderMiddlewareWithJson("any"),
  validateAddRoom(),
  ValidateHasUploadFilesMiddleware,
  RoomController.postAddRoom
);

router.patch(
  "/:roomId",
  //
  AuthenticateMiddleware,
  UserSelfChangeOrAdminMiddleware,
  UploaderMiddlewareWithJson("any"),
  validateEditRoom(),
  ValidateHasUploadFilesMiddleware,
  RoomController.patchEditRoom
);

export { router as roomV1Router };
