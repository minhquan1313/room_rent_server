import NewsController from "@/controllers/NewsController";
import express from "express";

const router = express.Router();

router.use("/:newNTitle", NewsController.getNew);
router.use("/", NewsController.getIndex);

export { router as newsRouter };
