import UserController from "@/controllers/apiV1/UserController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { CachedMiddleware } from "@/middlewares/CachedMiddleware";
import { PermissionAdminLvl2, UserSelfChangeOrAdminMiddleware } from "@/middlewares/PermissionMiddleware";
import { UploaderMiddlewareWithJson } from "@/middlewares/UploaderMiddleware";
import { ValidateHasUploadFilesMiddleware, ValidateMiddleware } from "@/middlewares/ValidateMiddleware";
import { validateLoginUser, validateRegisterUser, validateUpdateUser } from "@/models/User/User";
import express from "express";

// /api/v1/users
const router = express.Router();

router.get("/", CachedMiddleware(), AuthenticateMiddleware, PermissionAdminLvl2, UserController.get);
router.get("/:userId", AuthenticateMiddleware, UserController.getSingle);

// router.post("/transfer-admin");
router.post("/login-token", AuthenticateMiddleware, UserController.postLoginToken);
router.post("/login", validateLoginUser(), ValidateMiddleware, UserController.postLogin);
router.post(
  "/",
  //
  UploaderMiddlewareWithJson("any"),
  validateRegisterUser(),
  ValidateHasUploadFilesMiddleware,
  UserController.postCreateUser
);

// router.patch("/image/:userId", AuthenticateMiddleware, UserSelfChangeOrAdminMiddleware, UploaderMiddleware.single("file"), UserController.patchImage);
// router.patch("/owner_banner/:userId", AuthenticateMiddleware, PermissionPlaceOwner, UploaderMiddleware.single("file"), UserController.patchOwnerBanner);

// router.patch("/role/:userId", AuthenticateMiddleware, PermissionAdmin, UserController.patchChangeRole);

router.patch(
  "/:userId",
  //
  AuthenticateMiddleware,
  UserSelfChangeOrAdminMiddleware,
  UploaderMiddlewareWithJson("any"),
  validateUpdateUser(),
  ValidateHasUploadFilesMiddleware,
  UserController.patch
);

router.delete("/:userId", AuthenticateMiddleware, UserSelfChangeOrAdminMiddleware, UserController.delete);

export { router as userV1Router };
