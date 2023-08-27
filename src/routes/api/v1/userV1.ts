import UserController from "@/controllers/apiV1/UserController";
import { AuthenticateMiddleware } from "@/middlewares/AuthenticateMiddleware";
import { CheckUserIdMiddleware } from "@/middlewares/GetUserByIdMiddleware";
import { validateRegisterUser } from "@/models/User/User";
import express from "express";

// /api/v1/users
const router = express.Router();

router.get("/", AuthenticateMiddleware, UserController.get);
router.get("/:userId", CheckUserIdMiddleware, UserController.getSingle);

router.post("/login", UserController.postLogin);
router.post("/", validateRegisterUser(), UserController.validatePreCreateUser, UserController.post);

router.patch("/:userId", UserController.patch);

router.delete("/:userId", UserController.delete);

export { router as userV1Router };
