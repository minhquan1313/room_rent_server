import ApiV1Controller from "@/controllers/apiV1/ApiController";
import { userV1Router } from "@/routes/api/v1/userV1";
import express from "express";

// /api/v1
const router = express.Router();

router.get("/get-preload", ApiV1Controller.getPreload);
router.delete("/delete-all", ApiV1Controller.deleteAll);

router.use("/users", userV1Router);

export { router as apiV1Router };
