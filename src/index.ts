import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { createFolderFsSync } from "@/Utils/createFolderFsSync";
import preload from "@/Utils/preload";
import initSocket from "@/chatSocket/initSocket";
import db from "@/config/db";
import { publicStaticServer, publicStaticUser } from "@/constants/constants";
import router from "@/routes";
import PushNotificationService from "@/services/PushNotificationService";
import SmsService from "@/services/SmsService";
import cors from "cors";
import express from "express";
import { queryParser } from "express-query-parser";
import morgan from "morgan";

// console.clear();

db.connect();

PushNotificationService.init();
SmsService.init();

preload();
createFolderFsSync(publicStaticUser);

// const corsOptions = {
//   origin: "*",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   preflightContinue: false,
//   optionsSuccessStatus: StatusCodes.NO_CONTENT,
// };

const app = express();
app.use(cors());
// app.use(cors(corsOptions));

const server = initSocket(app);
// fireBase.init();
app.use(express.static(publicStaticServer));
app.use(express.static(publicStaticUser));
app.use(morgan("dev"));

// form data but no enctype="multipart/form-data" AKA x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// fetch with json and "Content-Type": "application/json"
app.use(express.json());
app.use(
  queryParser({
    parseBoolean: true,
    parseNumber: true,
  })
);

app.use(router);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  // app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT} | http://localhost:${PORT}`);
});
