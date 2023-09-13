import { publicStaticServer } from "@/index";
import { apiRouter } from "@/routes/api/api";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.use("/api", apiRouter);

router.get("/", (req, res) => {
  res.send(`Hello, day la trang chu`);
});

router.use("*", function (req, res) {
  res.status(StatusCodes.NOT_FOUND).sendFile(`page404.html`, {
    root: publicStaticServer,
  });
});

export default router;
