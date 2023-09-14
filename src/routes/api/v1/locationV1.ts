import RoomLocationController from "@/controllers/apiV1/RoomLocationController";
import { CachedMiddleware } from "@/middlewares/CachedMiddleware";
import express from "express";

// const _30days = 30 * 24 * 60 * 60 * 1000;
// /api/v1/location
const router = express.Router();

router.get("/countries", CachedMiddleware(), RoomLocationController.getCountries);

router.get("/provinces", CachedMiddleware(), RoomLocationController.getProvinces);

router.get("/districts", CachedMiddleware(), RoomLocationController.getDistricts);

router.get("/wards", CachedMiddleware(), RoomLocationController.getWards);

router.get("/resolve", CachedMiddleware(), RoomLocationController.getResolve);

export { router as locationV1Router };
