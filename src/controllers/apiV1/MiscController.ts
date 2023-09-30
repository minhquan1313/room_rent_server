import { errorResponse } from "@/Utils/errorRes";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import MailService from "@/services/MailService";
import MiscService from "@/services/MiscService";
import NotificationService, { TSubscription } from "@/services/NotificationService";
import PhoneService from "@/services/PhoneService";
import SmsService from "@/services/SmsService";
import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class MiscController {
  async makeVerifyEmail(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const token = MailService.makeVerifyCode(email);
      await MailService.sendEmailVerifyCode({
        email,
        code: token,
      });

      res.status(HttpStatusCode.Ok).json({});
    } catch (error: any) {
      console.log(`🚀 ~ MiscController ~ makeVerifyEmail ~ error:`, error);

      return res.status(StatusCodes.FORBIDDEN).json(errorResponse(String(error)));
    }
  }
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;

      const result = await MailService.verifyCode(token);

      if (result) {
        return res.status(HttpStatusCode.Ok).json({});
      } else {
        return res.status(HttpStatusCode.BadRequest).json({});
      }
    } catch (error: any) {
      console.log(`🚀 ~ MiscController ~ verifyEmail ~ error:`, error);

      return res.status(StatusCodes.FORBIDDEN).json(errorResponse(String(error)));
    }
  }
  async verifyTel(req: Request, res: Response, next: NextFunction) {
    try {
      // tel as e164_format
      const { tel, code } = req.body;

      const result = await SmsService.verifyCode(tel, code);

      if (result.valid) {
        await PhoneService.updateValid(tel, true);
      }

      res.json(result);
    } catch (error: any) {
      console.log(`🚀 ~ MiscController ~ verifyTel ~ error:`, error);

      return res.status(StatusCodes.FORBIDDEN).json(errorResponse(String(error)));
    }
  }
  async makeVerifyTel(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { tel } = req.body;
      console.log(`🚀 ~ MiscController ~ makeVerifyTel ~ tel:`, tel);

      const result = await SmsService.makeVerifyCode(tel);

      res.json(result);
    } catch (error: any) {
      return res.status(StatusCodes.FORBIDDEN).json(errorResponse(String(error)));
    }
  }
  async subscribePush(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { user } = req;

      const doc = await NotificationService.newSubscribe({
        ...(req.body as TSubscription),

        user: String(user?._id),
      });
      console.log(`🚀 ~ MiscController ~ subscribePush ~ doc:`, doc);

      res.status(HttpStatusCode.Ok).json({});
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async saveRoom(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      // const { room }: TSaveRoomPayload = req.body;

      await MiscService.saveRoom(user!._id.toString(), req.body);

      res.status(HttpStatusCode.Ok).json({});
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
}

export default new MiscController();
