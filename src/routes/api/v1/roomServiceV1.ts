import RoomServiceController from "@/controllers/apiV1/RoomServiceController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { PermissionAdmin } from "@/middlewares/PermissionMiddleware";
import express from "express";

// /api/v1/room-services
const router = express.Router();

router.get(
  "/",
  //  CachedMiddleware(),
  RoomServiceController.getAll
);

router.post("/", AuthenticateMiddleware, PermissionAdmin, RoomServiceController.postAdd);

router.patch("/:serviceId", AuthenticateMiddleware, PermissionAdmin, RoomServiceController.patch);

router.delete("/:serviceId", AuthenticateMiddleware, PermissionAdmin, RoomServiceController.delete);

export { router as roomServiceV1Router };
