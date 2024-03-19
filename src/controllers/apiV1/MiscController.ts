import { errorResponse } from "@/Utils/errorRes";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import MailService from "@/services/MailService";
import MiscService from "@/services/MiscService";
import NotificationService, { TSubscription } from "@/services/NotificationService";
import PhoneService from "@/services/PhoneService";
import SmsService from "@/services/SmsService";
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

      res.status(StatusCodes.OK).json({});
    } catch (error: any) {
      console.log(`🚀 ~ MiscController ~ makeVerifyEmail ~ error:`, error);

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", String(error)));
    }
  }
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;

      const result = await MailService.verifyCode(token);

      if (result) {
        return res.status(StatusCodes.OK).json({});
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({});
      }
    } catch (error: any) {
      console.log(`🚀 ~ MiscController ~ verifyEmail ~ error:`, error);

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", String(error)));
    }
  }
  async verifyTel(req: Request, res: Response, next: NextFunction) {
    try {
      // tel as e164_format
      const { tel, code } = req.body;
      const result = await SmsService.verifyCode(tel, code);
      if (result.valid) {
        await PhoneService.updateValid(tel, true);
      } else {
        return res.status(StatusCodes.FORBIDDEN).json(errorResponse("403103"));
      }
      res.json(result);
    } catch (error: any) {
      console.log(`🚀 ~ MiscController ~ verifyTel ~ error:`, error);

      let code = StatusCodes.INTERNAL_SERVER_ERROR;
      let response = errorResponse("500", String(error));

      if (error?.status === 404) {
        code = StatusCodes.FORBIDDEN;
        response = errorResponse("403102", String(error));
      }

      return res.status(code).json(response);
    }
  }
  async makeVerifyTel(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { tel } = req.body;
      const result = await SmsService.makeVerifyCode(tel);
      res.json(result);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", String(error)));
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

      res.status(StatusCodes.OK).json({});
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
  async saveRoom(req: RequestAuthenticate, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      // const { room }: TSaveRoomPayload = req.body;

      await MiscService.saveRoom(user!._id.toString(), req.body);

      res.status(StatusCodes.OK).json({});
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
}

export default new MiscController();
