import { errorResponse } from "@/Utils/errorRes";
import RoomLocationService from "@/services/RoomLocationService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class RoomLocationController {
  async getCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await RoomLocationService.getCountries();

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async getProvinces(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await RoomLocationService.getProvinces({ country: req.query.country });

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async getDistricts(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await RoomLocationService.getDistricts({ province: req.query.province });

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async getWards(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await RoomLocationService.getWards({ district: req.query.district });

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async getCountriesAll(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await RoomLocationService.getCountries({ ...req.query, all: true });

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async getProvincesAll(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await RoomLocationService.getProvinces({ ...req.query, all: true });

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async getDistrictsAll(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await RoomLocationService.getDistricts({ ...req.query, all: true });

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
    }
  }
  async getWardsAll(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await RoomLocationService.getWards({ ...req.query, all: true });

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
