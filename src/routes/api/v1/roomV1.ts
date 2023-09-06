import RoomController from "@/controllers/apiV1/RoomController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { UserSelfChangeOrAdminMiddleware } from "@/middlewares/PermissionMiddleware";
import { UploaderMiddlewareWithJson } from "@/middlewares/UploaderMiddleware";
import { ValidateHasUploadFilesMiddleware } from "@/middlewares/ValidateMiddleware";
import { validateAddRoom, validateEditRoom } from "@/models/Room/Room";
import express from "express";

// /api/v1/rooms
const router = express.Router();

router.get("/exist-provinces", RoomController.getExistProvinces);
router.get("/exist-districts", RoomController.getExistDistricts);
router.get("/exist-wards", RoomController.getExistWards);
router.get("/", RoomController.getAll);

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
  UploaderMiddlewareWithJson("array", "files"),
  validateAddRoom(),
  ValidateHasUploadFilesMiddleware,
  RoomController.postAddRoom
);

router.patch(
  "/:roomId",
  //
  AuthenticateMiddleware,
  UserSelfChangeOrAdminMiddleware,
  UploaderMiddlewareWithJson("array", "files"),
  validateEditRoom(),
  ValidateHasUploadFilesMiddleware,
  RoomController.patchEditRoom
);

export { router as roomV1Router };
