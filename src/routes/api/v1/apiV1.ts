import ApiController from "@/controllers/apiV1/ApiController";
import { genderV1Router } from "@/routes/api/v1/genderV1";
import { locationV1Router } from "@/routes/api/v1/locationV1";
import { miscV1Router } from "@/routes/api/v1/miscV1";
import { roleV1Router } from "@/routes/api/v1/roleV1";
import { roomServiceV1Router } from "@/routes/api/v1/roomServiceV1";
import { roomTypeV1Router } from "@/routes/api/v1/roomTypeV1";
import { roomV1Router } from "@/routes/api/v1/roomV1";
import { userV1Router } from "@/routes/api/v1/userV1";
import { Router } from "express";

// /api/v1
const router = Router();

router.use("/users", userV1Router);
router.use("/rooms", roomV1Router);
router.use("/roles", roleV1Router);
router.use("/genders", genderV1Router);
router.use("/room-services", roomServiceV1Router);
router.use("/room-types", roomTypeV1Router);
router.use("/location", locationV1Router);
router.use("/misc", miscV1Router);

router.use("/", ApiController.index);

export { router as apiV1Router };
