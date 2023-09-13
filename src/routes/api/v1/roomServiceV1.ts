import RoomServiceController from "@/controllers/apiV1/RoomServiceController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { CachedMiddleware } from "@/middlewares/CachedMiddleware";
import { PermissionAdmin } from "@/middlewares/PermissionMiddleware";
import express from "express";

// /api/v1/room-services
const router = express.Router();

router.get("/", CachedMiddleware(), RoomServiceController.getAll);

router.post("/", AuthenticateMiddleware, PermissionAdmin, RoomServiceController.postAdd);

router.patch("/:roleId", AuthenticateMiddleware, PermissionAdmin, RoomServiceController.patch);

router.delete("/:roleId", AuthenticateMiddleware, PermissionAdmin, RoomServiceController.delete);

export { router as roomServiceV1Router };
