import ApiV1Controller from "@/controllers/ApiV1Controller";
import express from "express";

const router = express.Router();

router.delete("/delete-all", ApiV1Controller.deleteDeleteAll);
router.get("/", ApiV1Controller.get);

export { router as apiV1Router };
