import StatisticsController from "@/controllers/apiV1/StatisticsController";
import { CachedMiddleware } from "@/middlewares/CachedMiddleware";
import express from "express";

// /api/v1/stats
const router = express.Router();

router.get("/count-room", CachedMiddleware(), StatisticsController.countRoom);

router.get("/count-room/:province", CachedMiddleware(), StatisticsController.countRoomProvince);

export { router as statsV1Router };
