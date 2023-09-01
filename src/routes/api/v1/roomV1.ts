import RoomController from "@/controllers/apiV1/RoomController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { UserSelfChangeOrAdminMiddleware } from "@/middlewares/PermissionMiddleware";
import UploaderMiddleware from "@/middlewares/UploaderMiddleware";
import { ValidateMiddleware } from "@/middlewares/ValidateMiddleware";
import { validateAddRoom } from "@/models/Room/Room";
import express from "express";

// /api/v1/rooms
const router = express.Router();

router.get("/", RoomController.getAll);
// router.get("/:userId", AuthenticateMiddleware, UserController.getSingle);

router.post("/", AuthenticateMiddleware, validateAddRoom(), ValidateMiddleware, RoomController.validatePreAddRoom, RoomController.postAddRoom);

router.patch("/image/:roomId", AuthenticateMiddleware, UserSelfChangeOrAdminMiddleware, UploaderMiddleware.array("images"), RoomController.patchImage);

// router.patch("/:userId", AuthenticateMiddleware, UserSelfChangeOrAdminMiddleware, UserController.patch);
// router.patch("/image/:userId", AuthenticateMiddleware, UserSelfChangeOrAdminMiddleware, UploaderMiddleware.single("image"), UserController.patchImage);
// router.patch("/owner_banner/:userId", AuthenticateMiddleware, PermissionPlaceOwner, UploaderMiddleware.single("image"), UserController.patchOwnerBanner);
// router.patch("/role/:userId", AuthenticateMiddleware, PermissionAdminLvl2, UserController.patchChangeRole);

// router.delete("/:userId", AuthenticateMiddleware, UserSelfChangeOrAdminMiddleware, UserController.delete);

export { router as roomV1Router };
