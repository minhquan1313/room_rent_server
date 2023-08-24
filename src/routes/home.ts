import HomeController from "@/controllers/HomeController";
import express from "express";

const router = express.Router();

router.use("/", HomeController.getIndex);

export { router as homeRouter };
