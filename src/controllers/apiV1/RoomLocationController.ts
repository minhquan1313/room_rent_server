import { errorResponse } from "@/Utils/errorRes";
import Location3rdVNService from "@/services/Location3rdVNService";
import RoomLocationService, { LocationSearchQuery } from "@/services/RoomLocationService";
import { Location3rd } from "@/types/Location3rd";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class RoomLocationController {
  async getCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await RoomLocationService.getCountries(req.query);

      // if(Object.keys(req.query).)

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async getProvinces(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await RoomLocationService.getProvinces(req.query);

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async getDistricts(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await RoomLocationService.getDistricts(req.query);

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async getWards(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await RoomLocationService.getWards(req.query);

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async getResolve(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await RoomLocationService.resolve(req.query);

      // const results = await RoomLocationService.resolve(req.query);
      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
}

export default new RoomLocationController();
