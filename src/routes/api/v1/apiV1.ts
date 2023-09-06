import ApiController from "@/controllers/apiV1/ApiController";
import { roomV1Router } from "@/routes/api/v1/roomV1";
import { userV1Router } from "@/routes/api/v1/userV1";
import { Router } from "express";

// /api/v1
const router = Router();

router.use("/test", (req, res) => {
  res.json(req.body);
});
router.use("/users", userV1Router);
router.use("/rooms", roomV1Router);

router.use("/", ApiController.index);

export { router as apiV1Router };
