import GenderController from "@/controllers/apiV1/GenderController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { PermissionAdmin } from "@/middlewares/PermissionMiddleware";
import express from "express";

// /api/v1/genders
const router = express.Router();

router.get("/", GenderController.getAll);

router.post("/", AuthenticateMiddleware, PermissionAdmin, GenderController.postAdd);

router.patch("/:roleId", AuthenticateMiddleware, PermissionAdmin, GenderController.patch);

router.delete("/:roleId", AuthenticateMiddleware, PermissionAdmin, GenderController.delete);

export { router as genderV1Router };
