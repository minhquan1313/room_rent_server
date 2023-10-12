import RoomLocationController from "@/controllers/apiV1/RoomLocationController";
import { CachedMiddleware } from "@/middlewares/CachedMiddleware";
import express from "express";

const duration = 1 * 24 * 60 * 60 * 1000;
// /api/v1/location
const router = express.Router();

router.get(
  "/countries",
  //
  RoomLocationController.getCountries
);
router.get(
  "/countries-all",
  //
  RoomLocationController.getCountriesAll
);

router.get(
  "/provinces",
  //
  RoomLocationController.getProvinces
);
router.get(
  "/provinces-all",
  //
  RoomLocationController.getProvincesAll
);

router.get(
  "/districts",
  //
  RoomLocationController.getDistricts
);
router.get(
  "/districts-all",
  //
  RoomLocationController.getDistrictsAll
);

router.get(
  "/wards",
  //
  RoomLocationController.getWards
);
router.get(
  "/wards-all",
  //
  RoomLocationController.getWardsAll
);

router.get(
  "/resolve",
  //
  CachedMiddleware({ duration }),
  RoomLocationController.getResolve
);

export { router as locationV1Router };
