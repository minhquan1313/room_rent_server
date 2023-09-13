import RoomTypeController from "@/controllers/apiV1/RoomTypeController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { CachedMiddleware } from "@/middlewares/CachedMiddleware";
import { PermissionAdmin } from "@/middlewares/PermissionMiddleware";
import express from "express";

// /api/v1/room-types
const router = express.Router();

router.get("/", CachedMiddleware(), RoomTypeController.getAll);

router.post("/", AuthenticateMiddleware, PermissionAdmin, RoomTypeController.postAdd);

router.patch("/:roleId", AuthenticateMiddleware, PermissionAdmin, RoomTypeController.patch);

router.delete("/:roleId", AuthenticateMiddleware, PermissionAdmin, RoomTypeController.delete);

export { router as roomTypeV1Router };
