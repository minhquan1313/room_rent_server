import UserController from "@/controllers/apiV1/UserController";
import { AuthenticateMiddleware, IsAuthenticatedMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { PermissionAdmin, PermissionAdminLvl2, UserSelfChangeOrAdminMiddleware } from "@/middlewares/PermissionMiddleware";
import { UploaderMiddlewareWithJson } from "@/middlewares/UploaderMiddleware";
import { ValidateHasUploadFilesMiddleware, ValidateMiddleware } from "@/middlewares/ValidateMiddleware";
import { validateLoginUser, validateRegisterUser, validateUpdateUser } from "@/validators/user";
import express from "express";

// /api/v1/users
const router = express.Router();

router.get(
  //
  "/",
  AuthenticateMiddleware,
  PermissionAdminLvl2,
  UserController.get
);
router.get(
  //
  "/:userId",
  UserController.getSingle
);

router.post(
  //
  "/login-token",
  AuthenticateMiddleware,
  UserController.postLoginToken
);
router.post(
  //
  "/login",
  validateLoginUser(),
  ValidateMiddleware,
  UserController.postLogin
);

router.post(
  //
  "/",
  IsAuthenticatedMiddleware,
  validateRegisterUser(),
  ValidateMiddleware,
  UserController.postCreateUser
);

router.patch(
  //
  "/:userId",
  AuthenticateMiddleware,
  UserSelfChangeOrAdminMiddleware,
  UploaderMiddlewareWithJson("single", "file"),
  validateUpdateUser(),
  ValidateHasUploadFilesMiddleware,
  UserController.patch
);

router.delete(
  //
  "/:userId",
  AuthenticateMiddleware,
  PermissionAdmin,
  UserController.delete
);

export { router as userV1Router };
