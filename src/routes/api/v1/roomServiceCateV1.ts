import RoomServiceCateController from "@/controllers/apiV1/RoomServiceCateController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { CachedMiddleware } from "@/middlewares/CachedMiddleware";
import { PermissionAdmin } from "@/middlewares/PermissionMiddleware";
import express from "express";

// /api/v1/room-services-cate
const router = express.Router();

router.get("/", CachedMiddleware(), RoomServiceCateController.getAll);

router.post("/", AuthenticateMiddleware, PermissionAdmin, RoomServiceCateController.postAdd);

router.patch("/:roleId", AuthenticateMiddleware, PermissionAdmin, RoomServiceCateController.patch);

router.delete("/:roleId", AuthenticateMiddleware, PermissionAdmin, RoomServiceCateController.delete);

export { router as roomServiceCateV1Router };
