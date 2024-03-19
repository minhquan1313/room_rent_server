import StatisticsController from "@/controllers/apiV1/StatisticsController";
import { ParseNumberMiddleware } from "@/middlewares/ParseNumberMiddleware";
import express from "express";

// /api/v1/stats
const router = express.Router();

router.get(
  "/count-room",
  //  CachedMiddleware(),
  ParseNumberMiddleware,
  StatisticsController.countRoom
);

router.get(
  "/count-user",
  //  CachedMiddleware(),
  ParseNumberMiddleware,
  StatisticsController.countUser
);

export { router as statsV1Router };
