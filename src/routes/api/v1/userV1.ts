import UserController from "@/controllers/apiV1/UserController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { PermissionAdmin, UserSelfChangeOrAdminMiddleware } from "@/middlewares/PermissionMiddleware";
import { UploaderMiddlewareWithJson } from "@/middlewares/UploaderMiddleware";
import { ValidateHasUploadFilesMiddleware, ValidateMiddleware } from "@/middlewares/ValidateMiddleware";
import { validateLoginUser, validateRegisterUser, validateUpdateUser } from "@/validators/user";
import express from "express";

// /api/v1/users
const router = express.Router();

router.get(
  "/",
  //
  // AuthenticateMiddleware,
  // PermissionAdminLvl2,
  // CachedMiddleware(),
  UserController.get
);
router.get(
  "/:userId",
  //  AuthenticateMiddleware,
  // CachedMiddleware(),
  UserController.getSingle
);

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

// router.patch(
//   "/v2/:userId",
//   //
//   AuthenticateMiddleware,
//   UserSelfChangeOrAdminMiddleware,
//   UploaderMiddlewareWithJson("single", "file"),
//   validateUpdateUser(),
//   ValidateHasUploadFilesMiddleware,
//   UserController.patchV2
// );
router.patch(
  "/:userId",
  //
  AuthenticateMiddleware,
  UserSelfChangeOrAdminMiddleware,
  UploaderMiddlewareWithJson("single", "file"),
  validateUpdateUser(),
  ValidateHasUploadFilesMiddleware,
  UserController.patch
);

router.delete("/:userId", AuthenticateMiddleware, PermissionAdmin, UserController.delete);

export { router as userV1Router };
