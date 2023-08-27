import preload from "@/Utils/preload";
import db from "@/config/db";
import route from "@/routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

dotenv.config({ path: "./.env" });
db.connect().catch(() => {
  throw new Error(`Can't connect to database`);
});
preload();

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cookieParser());

route(app);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT} | http://localhost:${PORT}`);

  console.log(process.env.PORT);
});
