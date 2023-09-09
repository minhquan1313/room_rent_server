import RoomTypeController from "@/controllers/apiV1/RoomTypeController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { PermissionAdmin } from "@/middlewares/PermissionMiddleware";
import express from "express";

// /api/v1/room-types
const router = express.Router();

router.get("/", RoomTypeController.getAll);

router.post("/", AuthenticateMiddleware, PermissionAdmin, RoomTypeController.postAdd);

router.patch("/:roleId", AuthenticateMiddleware, PermissionAdmin, RoomTypeController.patch);

router.delete("/:roleId", AuthenticateMiddleware, PermissionAdmin, RoomTypeController.delete);

export { router as roomTypeV1Router };
