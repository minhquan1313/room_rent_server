import UserController from "@/controllers/apiV1/UserController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { PermissionAdminLvl2, PermissionPlaceOwner, UserSelfChangeOrAdminMiddleware } from "@/middlewares/PermissionMiddleware";
import UploaderMiddleware from "@/middlewares/UploaderMiddleware";
import { ValidateMiddleware } from "@/middlewares/ValidateMiddleware";
import { validateLoginUser, validateRegisterUser } from "@/models/User/User";
import express from "express";

// /api/v1/users
const router = express.Router();

router.post("/upload", UploaderMiddleware.single("file2"), UserController.upload);
router.post("/upload-many", UploaderMiddleware.array("files2"), UserController.uploadMany);

router.get("/", AuthenticateMiddleware, UserController.get);
router.get("/:userId", AuthenticateMiddleware, UserController.getSingle);

router.post("/login-token", AuthenticateMiddleware, UserController.postLoginToken);
router.post("/login", validateLoginUser(), ValidateMiddleware, UserController.postLogin);
router.post("/", validateRegisterUser(), ValidateMiddleware, UserController.validatePreCreateUser, UserController.post);

router.patch("/image/:userId", AuthenticateMiddleware, UserSelfChangeOrAdminMiddleware, UploaderMiddleware.single("image"), UserController.patchImage);
router.patch("/owner_banner/:userId", AuthenticateMiddleware, PermissionPlaceOwner, UploaderMiddleware.single("image"), UserController.patchOwnerBanner);
router.patch("/role/:userId", AuthenticateMiddleware, PermissionAdminLvl2, UserController.patchChangeRole);
router.patch("/:userId", AuthenticateMiddleware, UserSelfChangeOrAdminMiddleware, UserController.patch);

router.delete("/:userId", AuthenticateMiddleware, UserSelfChangeOrAdminMiddleware, UserController.delete);

export { router as userV1Router };
