import { createFolderFsSync } from "@/Utils/createFolderFsSync";
import preload from "@/Utils/preload";
import db from "@/config/db";
import router from "@/routes";
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

export const publicStaticServer = path.join(__dirname, "static");

export const publicStaticUser = path.join(process.cwd(), "userDataUpload");
createFolderFsSync(publicStaticUser);

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: StatusCodes.NO_CONTENT,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.static(publicStaticServer));
app.use(express.static(publicStaticUser));
app.use(morgan("dev"));

// form data but no enctype="multipart/form-data" AKA x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// fetch with json and "Content-Type": "application/json"
app.use(express.json());

app.use(router);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT} | http://localhost:${PORT}`);
});
