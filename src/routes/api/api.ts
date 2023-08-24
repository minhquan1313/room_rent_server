import { apiV1Router } from "@/routes/api/apiV1";
import express from "express";

const router = express.Router();

router.use("/v1", apiV1Router);

export { router as apiRouter };
