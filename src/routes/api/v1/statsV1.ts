import StatisticsController from "@/controllers/apiV1/StatisticsController";
import express from "express";

// /api/v1/stats
const router = express.Router();

router.get(
  "/count-room",
  //  CachedMiddleware(),
  StatisticsController.countRoom
);

router.get(
  "/count-user",
  //  CachedMiddleware(),
  StatisticsController.countUser
);

export { router as statsV1Router };
