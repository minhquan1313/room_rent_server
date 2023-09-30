import SavedController from "@/controllers/apiV1/SavedController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import express from "express";

// /api/v1/saved
const router = express.Router();

router.get(
  "/",
  // CachedMiddleware(),
  AuthenticateMiddleware,
  SavedController.getOrSearch
);

router.post("/", AuthenticateMiddleware, SavedController.postAdd);

// router.patch("/:roleId", AuthenticateMiddleware, PermissionAdmin, SavedController.patch);

router.delete("/:id", AuthenticateMiddleware, SavedController.delete);

export { router as savedV1Router };
