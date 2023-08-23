import { newsRouter } from "@/routes/news";
import { Application } from "express";

function route(app: Application) {
  app.use("/news", newsRouter);

  app.get("/", (req, res) => {
    //   console.log(req.query);
    res.send("Hello World!");
  });
}

export default route;
