import RoomLocationController from "@/controllers/apiV1/RoomLocationController";
import express from "express";

// /api/v1/location
const router = express.Router();

router.get("/countries", RoomLocationController.getExistCountries);
router.get("/provinces", RoomLocationController.getExistProvinces);
router.get("/districts", RoomLocationController.getExistDistricts);
router.get("/wards", RoomLocationController.getExistWards);

export { router as locationV1Router };
