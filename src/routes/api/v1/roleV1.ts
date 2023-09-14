import RoleController from "@/controllers/apiV1/RoleController";
import { AuthenticateMiddleware, IsAuthenticatedMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { CachedMiddleware } from "@/middlewares/CachedMiddleware";
import { PermissionAdmin } from "@/middlewares/PermissionMiddleware";
import express from "express";

// /api/v1/roles
const router = express.Router();

// router.get("/", AuthenticateMiddleware, RoleController.getAll);
router.get("/", CachedMiddleware(), IsAuthenticatedMiddleware, RoleController.getAll);

router.post("/", AuthenticateMiddleware, PermissionAdmin, RoleController.postAdd);

router.patch("/:roleId", AuthenticateMiddleware, PermissionAdmin, RoleController.patch);

router.delete("/:roleId", AuthenticateMiddleware, PermissionAdmin, RoleController.delete);

export { router as roleV1Router };
