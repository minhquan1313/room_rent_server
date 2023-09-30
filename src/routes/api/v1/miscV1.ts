import MiscController from "@/controllers/apiV1/MiscController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { ValidateMiddleware } from "@/middlewares/ValidateMiddleware";
import { validateMakeVerifyEmail, validateVerifyEmail } from "@/validators/misc";
import express from "express";

// /api/v1/misc
const router = express.Router();

// router.get("/", RoomTypeController.getAll);

router.post("/save-room", AuthenticateMiddleware, MiscController.saveRoom);

router.post("/subscribe-push", AuthenticateMiddleware, MiscController.subscribePush);

router.post("/make-verify-tel", AuthenticateMiddleware, MiscController.makeVerifyTel);
router.post("/verify-tel", MiscController.verifyTel);

router.post("/make-verify-email", AuthenticateMiddleware, validateMakeVerifyEmail(), ValidateMiddleware, MiscController.makeVerifyEmail);
router.post("/verify-email", validateVerifyEmail(), ValidateMiddleware, MiscController.verifyEmail);

export { router as miscV1Router };
