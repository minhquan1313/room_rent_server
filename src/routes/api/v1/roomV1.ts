import RoomController from "@/controllers/apiV1/RoomController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { UserSelfChangeOrAdminRoomMiddleware } from "@/middlewares/PermissionMiddleware";
import UploaderMiddleware from "@/middlewares/UploaderMiddleware";
import { ValidateMiddleware } from "@/middlewares/ValidateMiddleware";
import { validateAddRoom } from "@/models/Room/Room";
import express from "express";

// /api/v1/rooms
const router = express.Router();

router.get("/", RoomController.getAll);

router.post("/image/:roomId", AuthenticateMiddleware, UserSelfChangeOrAdminRoomMiddleware, UploaderMiddleware.array("images"), RoomController.postUploadImagesAndAdd);
router.post("/", AuthenticateMiddleware, validateAddRoom(), ValidateMiddleware, RoomController.validatePreAddRoom, RoomController.postAddRoom);

// router.patch("/image/:roomId/:imageId", AuthenticateMiddleware, UserSelfChangeOrAdminRoomMiddleware, RoomController.patchImageOrder);
router.patch("/:roomId", AuthenticateMiddleware, UserSelfChangeOrAdminRoomMiddleware, RoomController.patchEditRoom);

export { router as roomV1Router };
