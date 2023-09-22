import ChatController from "@/controllers/apiV1/ChatController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import express from "express";

// /api/v1/chat
const router = express.Router();

router.get("/room/search-by-receiver", AuthenticateMiddleware, ChatController.searchRoomByReceivers);

router.get("/room/:roomId", AuthenticateMiddleware, ChatController.searchChatRooms);
router.get("/list/:userId", AuthenticateMiddleware, ChatController.searchChatBubble);

router.delete("/room/:roomId", AuthenticateMiddleware, ChatController.deleteChatRoom);

// router.patch("/:roleId", AuthenticateMiddleware, PermissionAdmin, RoomTypeController.patch);

// router.delete("/:roleId", AuthenticateMiddleware, PermissionAdmin, RoomTypeController.delete);

export { router as chatV1Router };
