import { apiRouter } from "@/routes/api/api";
import { homeRouter } from "@/routes/home";
import { Application } from "express";

function route(app: Application) {
  app.use("/api", apiRouter);

  app.get("/", homeRouter);

  app.use("*", function (req, res) {
    res.status(404).send("404 em iu à");
  });
}

export default route;
