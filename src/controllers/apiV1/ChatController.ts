import { errorResponse } from "@/Utils/errorRes";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import { ChatRoom } from "@/models/ChatSocket/ChatRoom";
import ChatSocketService, { TChatInRoomSearchPayload } from "@/services/ChatSocketService";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";

class ChatController {
  async searchRoomByReceivers(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      const { receivers } = req.query;
      console.log(`🚀 ~ ChatController ~ searchRoomByReceivers ~ receivers:`, receivers);

      const doc = await ChatSocketService.searchRoomHasOnlyMembers([...(receivers as string[])]);
      console.log(`🚀 ~ ChatController ~ searchRoomByReceivers ~ doc:`, doc);

      res.json(doc);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async deleteChatRoom(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;

      const doc = await ChatRoom.findOne({
        _id: roomId,
      });

      await doc?.deleteOne();
      console.log(`done delete`);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async searchChatBubble(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      // const { room }: TSaveRoomPayload = req.body;

      const d = await ChatSocketService.searchChatRoomBubbleList({
        ...req.query,
        user: userId,
      });
      // await MiscService.saveRoom(user!._id.toString(), req.body);

      res.json(d);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async searchChatRooms(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      // const { user } = req;
      const { roomId } = req.params;

      const d = await ChatSocketService.searchMessageOfRoom({
        ...(req.query as TChatInRoomSearchPayload),
        room: roomId,
      });
      // await MiscService.saveRoom(user!._id.toString(), req.body);

      res.json(d);
      // res.status(StatusCodes.NoContent);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
}

export default new ChatController();
