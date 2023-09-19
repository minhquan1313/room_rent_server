import { createFolderFsSync } from "@/Utils/createFolderFsSync";
import preload from "@/Utils/preload";
import initSocket from "@/chatSocket/initSocket";
import db from "@/config/db";
import { publicStaticServer, publicStaticUser } from "@/constants/constants";
import router from "@/routes";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

console.clear();

dotenv.config({ path: "./.env" });

db.connect();

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

app.use(express.static(publicStaticServer));
app.use(express.static(publicStaticUser));
app.use(morgan("dev"));

// form data but no enctype="multipart/form-data" AKA x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// fetch with json and "Content-Type": "application/json"
app.use(express.json());

app.use(router);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  // app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT} | http://localhost:${PORT}`);
});
