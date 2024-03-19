import { errorResponse } from "@/Utils/errorRes";
import LocationService from "@/services/LocationService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class RoomLocationController {
  async getCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await LocationService.getCountries();

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
  async getProvinces(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await LocationService.getProvinces({ country: req.query.country });

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
  async getDistricts(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await LocationService.getDistricts({ province: req.query.province });

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
  async getWards(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await LocationService.getWards({ district: req.query.district });

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
  async getCountriesAll(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await LocationService.getCountries({ ...req.query, all: true });

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
  async getProvincesAll(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await LocationService.getProvinces({ ...req.query, all: true });

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
  async getDistrictsAll(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await LocationService.getDistricts({ ...req.query, all: true });

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
  async getWardsAll(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await LocationService.getWards({ ...req.query, all: true });

      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
  async getResolve(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await LocationService.resolve(req.query);

      // const results = await LocationService.resolve(req.query);
      res.json(results);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse("500", error.toString()));
    }
  }
}

export default new RoomLocationController();
