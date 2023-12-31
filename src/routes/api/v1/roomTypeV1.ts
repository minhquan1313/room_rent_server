import RoomTypeController from "@/controllers/apiV1/RoomTypeController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { PermissionAdmin } from "@/middlewares/PermissionMiddleware";
import { ValidateMiddleware } from "@/middlewares/ValidateMiddleware";
import { validateRoomTypePatch, validateRoomTypePost } from "@/validators/roomType";
import express from "express";

// /api/v1/room-types
const router = express.Router();

router.get(
  "/",
  //  CachedMiddleware(),
  RoomTypeController.getAll
);

router.post("/", AuthenticateMiddleware, PermissionAdmin, validateRoomTypePost(), ValidateMiddleware, RoomTypeController.postAdd);

router.patch("/:roleId", AuthenticateMiddleware, PermissionAdmin, validateRoomTypePatch(), ValidateMiddleware, RoomTypeController.patch);

router.delete("/:roleId", AuthenticateMiddleware, PermissionAdmin, RoomTypeController.delete);

export { router as roomTypeV1Router };
