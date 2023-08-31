import { apiRouter } from "@/routes/api/api";
import { homeRouter } from "@/routes/home";
import { Application } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

function route(app: Application) {
  app.use("/api", apiRouter);

  app.get("/", homeRouter);

  app.use("*", function (req, res) {
    res.status(StatusCodes.NOT_FOUND).send(getReasonPhrase(StatusCodes.NOT_FOUND));
  });
}

export default route;
