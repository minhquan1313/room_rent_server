import RoomLocationController from "@/controllers/apiV1/RoomLocationController";
import { CachedMiddleware } from "@/middlewares/CachedMiddleware";
import express from "express";

const duration = 1 * 24 * 60 * 60 * 1000;
// /api/v1/location
const router = express.Router();

router.get(
  "/countries",
  //
  CachedMiddleware(),
  RoomLocationController.getCountries
);
router.get(
  "/countries-all",
  //
  CachedMiddleware({ duration }),
  RoomLocationController.getCountriesAll
);

router.get(
  "/provinces",
  //
  CachedMiddleware(),
  RoomLocationController.getProvinces
);
router.get(
  "/provinces-all",
  //
  CachedMiddleware({ duration }),
  RoomLocationController.getProvincesAll
);

router.get(
  "/districts",
  //
  CachedMiddleware(),
  RoomLocationController.getDistricts
);
router.get(
  "/districts-all",
  //
  CachedMiddleware({ duration }),
  RoomLocationController.getDistrictsAll
);

router.get(
  "/wards",
  //
  CachedMiddleware(),
  RoomLocationController.getWards
);
router.get(
  "/wards-all",
  //
  CachedMiddleware({ duration }),
  RoomLocationController.getWardsAll
);

router.get(
  "/resolve",
  //
  CachedMiddleware({ duration }),
  RoomLocationController.getResolve
);

export { router as locationV1Router };
