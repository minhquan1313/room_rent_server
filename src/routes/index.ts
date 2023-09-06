import { publicStaticServerFolder } from "@/index";
import { apiRouter } from "@/routes/api/api";
import { homeRouter } from "@/routes/home";
import { Application } from "express";
import { StatusCodes } from "http-status-codes";

function route(app: Application) {
  app.use("/api", apiRouter);

  app.get("/", homeRouter);

  app.use("*", function (req, res) {
    res.status(StatusCodes.NOT_FOUND).sendFile(`page404.html`, { root: publicStaticServerFolder });
  });
}

export default route;
