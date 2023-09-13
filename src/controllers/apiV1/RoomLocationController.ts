import RoomLocationService, { LocationSearchQuery } from "@/services/RoomLocationService";
import { NextFunction, Request, Response } from "express";

class RoomLocationController {
  async getExistCountries(req: Request, res: Response, next: NextFunction) {
    const results = await RoomLocationService.getExistCountries();

    res.json(results);
  }
  async getExistProvinces(req: Request, res: Response, next: NextFunction) {
    const { country }: LocationSearchQuery = req.query;
    console.log(`🚀 ~ RoomLocationController ~ getExistProvinces ~ country:`, country);

    let results;
    if (country) {
      results = await RoomLocationService.getProvinceBaseOnCountry(country);
    } else {
      results = await RoomLocationService.getExistProvinces();
    }

    res.json(results);
  }
  async getExistDistricts(req: Request, res: Response, next: NextFunction) {
    const results = await RoomLocationService.getExistDistricts();

    res.json(results);
  }
  async getExistWards(req: Request, res: Response, next: NextFunction) {
    const results = await RoomLocationService.getExistWards();

    res.json(results);
  }
}

export default new RoomLocationController();
