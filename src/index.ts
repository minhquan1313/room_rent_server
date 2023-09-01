import { createFolderFsSync } from "@/Utils/createFolderFsSync";
import preload from "@/Utils/preload";
import db from "@/config/db";
import route from "@/routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import path from "path";

console.clear();

dotenv.config({ path: "./.env" });
db.connect().catch(() => {
  throw new Error(`Can't connect to database`);
});

preload();

console.log(process.cwd());

export const publicStaticServerFolder = path.join(__dirname, "static");
createFolderFsSync(publicStaticServerFolder);

export const userStaticFolder = path.join(process.cwd(), "userDataUpload");
createFolderFsSync(userStaticFolder);

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: StatusCodes.NO_CONTENT,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.static(publicStaticServerFolder));
app.use(express.static(userStaticFolder));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

route(app);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT} | http://localhost:${PORT}`);

  console.log(process.env.PORT);
});
