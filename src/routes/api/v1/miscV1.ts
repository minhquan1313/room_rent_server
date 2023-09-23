import MiscController from "@/controllers/apiV1/MiscController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import express from "express";

// /api/v1/misc
const router = express.Router();

// router.get("/", RoomTypeController.getAll);

router.post("/save-room", AuthenticateMiddleware, MiscController.saveRoom);
router.post("/subscribe-push", AuthenticateMiddleware, MiscController.subscribePush);

// router.patch("/:roleId", AuthenticateMiddleware, PermissionAdmin, RoomTypeController.patch);

// router.delete("/:roleId", AuthenticateMiddleware, PermissionAdmin, RoomTypeController.delete);

export { router as miscV1Router };
