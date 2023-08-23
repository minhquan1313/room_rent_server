import route from "@/routes";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

const app = express();
app.use(morgan("combined"));

dotenv.config({ path: "./.env" });

const port = process.env.PORT;

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port} | http://localhost:${port}`);

  console.log(process.env.PORT);
});
