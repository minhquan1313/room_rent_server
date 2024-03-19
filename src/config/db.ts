import logger from "@/Utils/logger";
import { exec } from "child_process";
import { mkdirSync, readdirSync } from "fs";
import mongoose from "mongoose";
import path, { join } from "path";
import { cwd } from "process";

type TDumpParamsJson = {
  mode: "json";
  sourceToMongoExportExe: string;
  // collections?: (keyof typeof dataModels)[];
};
type TDumpParamsDump = {
  mode: "singleDump";
  sourceToMongoDumpExe: string;
  // collections?: (keyof typeof dataModels)[];
};
type TDump = TDumpParamsJson | TDumpParamsDump;

type TRestoreParamsJson = {
  mode: "json";
  sourceToMongoImportExe: string;
  sourceToJsonFolder: string;
};
type TRestoreParamsDump = {
  mode: "singleDump";
  sourceToMongoRestoreExe: string;
  sourceToDumpFile: string;
};
type TRestore = TRestoreParamsJson | TRestoreParamsDump;

class db {
  DB_URL: string;
  DB_NAME: string;

  constructor() {
    const { DB_URL, DB_NAME } = process.env;
    if (!DB_URL) throw new Error("Missing DB_URL");
    if (!DB_NAME) throw new Error("Missing DB_NAME");

    this.DB_URL = DB_URL;
    this.DB_NAME = DB_NAME;
  }

  async connect() {
    try {
      console.log(`Connecting to db`);
      await mongoose.connect(this.DB_URL + "/" + this.DB_NAME);
      console.log(`Connect to db SUCCESS`);
    } catch (error) {
      console.log(`🚀 ~ Error connecting db:`, error);
    }
  }

  dumpJson(params: TDumpParamsJson) {
    return new Promise(async (rs, rj) => {
      const { sourceToMongoExportExe } = params;

      /**
       * 'chatmemebers', 'users', ...
       *
       * Object.keys(mongoose.models) => names of model mongoose (User)
       *
       * mongoose.models["ChatMember"].collection.name => name in collection db (users)
       */

      const source = path.normalize(sourceToMongoExportExe);
      const time = String(new Date().getTime());

      let error = false;

      (await mongoose.connection.db.listCollections().toArray()).forEach(({ name }) => {
        if (error) return;
        //   console.log(`mongoexport -d room_rent_dev -c ${names.name} --jsonArray -o ./d/room_rent_dev/room_rent_dev.${names.name}.json`);
        const output = join(cwd(), "dump", time, `${this.DB_NAME}.${name}.json`);
        const cmd = [
          //
          source,
          // "mongoexport",
          `--uri="${this.DB_URL + "/" + this.DB_NAME}"`,
          `-c ${name}`,
          `/o ${output}`,
          "/jsonArray",
          // "/pretty",
        ];
        exec(cmd.join(" "), (err, stdout, stderr) => {
          if (err) {
            logger.error(`~🤖 db 🤖~ dump error ${name}:`, err);
            error = true;
            rj("Dump error");
            return;
          }

          // the *entire* stdout and stderr (buffered)
          logger(`~🤖 db 🤖~ dumped to `, output);
        });
      });
      if (!error) rs("Dump success");
      else rj("Some might NOT success dumped");
    });
  }

  async dumpSingleDump(params: TDumpParamsDump) {
    const { sourceToMongoDumpExe } = params;

    const source = path.normalize(sourceToMongoDumpExe);
    const time = String(new Date().getTime());

    const output = join(cwd(), "dump", time, `${this.DB_NAME}.dump`);

    // this wont throw error if path already exist
    mkdirSync(path.dirname(output), { recursive: true });

    const cmd = [
      //
      source,
      `--uri="${this.DB_URL + "/" + this.DB_NAME}"`,
      `--archive`,
      `>`,
      `${output}`,
    ];
    exec(cmd.join(" "), (err, stdout, stderr) => {
      if (err) {
        logger.error(`~🤖 db 🤖~ dump error ${this.DB_NAME}:`, err);
      }

      logger(`~🤖 db 🤖~ dumped to `, output);
    });
  }

  async restoreJson(params: TRestoreParamsJson) {
    const { sourceToMongoImportExe, sourceToJsonFolder } = params;

    const source = path.normalize(sourceToMongoImportExe);
    const data = path.normalize(sourceToJsonFolder);

    const fileNames = readdirSync(data);
    console.log({ fileNames });

    if (!0) return;
    const cmd = [
      //
      source,
      `--uri="${this.DB_URL + "/" + this.DB_NAME}"`,
      `--archive`,
      `<`,
      `${data}`,
    ];
    exec(cmd.join(" "), (err, stdout, stderr) => {
      if (err) {
        logger.error(`~🤖 db 🤖~ dump error ${this.DB_NAME}:`, err);
        return;
      }

      logger(`~🤖 db 🤖~ restore data successfully `);
    });
  }
  async restoreSingleDump(params: TRestoreParamsDump) {
    const { sourceToMongoRestoreExe, sourceToDumpFile } = params;

    const source = path.normalize(sourceToMongoRestoreExe);
    const data = path.normalize(sourceToDumpFile);

    const cmd = [
      //
      source,
      `--uri="${this.DB_URL + "/" + this.DB_NAME}"`,
      `--archive`,
      `<`,
      `${data}`,
    ];
    exec(cmd.join(" "), (err, stdout, stderr) => {
      if (err) {
        logger.error(`~🤖 db 🤖~ dump error ${this.DB_NAME}:`, err);
        return;
      }

      logger(`~🤖 db 🤖~ restore data successfully `);
    });
  }

  // https://www.mongodb.com/try/download/database-tools
  // MongoDB Command Line Database Tools Download
  async dump<T extends TDump["mode"]>(params: Extract<TDump, { mode: T }>) {
    const {
      // sourceToMongoExportExe,
      mode = "json",
      // collections = ["all"],
    } = params;

    switch (mode) {
      case "json":
        this.dumpJson(params as TDumpParamsJson);
        break;

      case "singleDump":
        this.dumpSingleDump(params as TDumpParamsDump);
        break;
      default:
        break;
    }
  }

  restore<T extends TRestore["mode"]>(params: Extract<TRestore, { mode: T }>) {
    const {
      // sourceToMongoExportExe,
      mode = "json",
      // collections = ["all"],
    } = params;

    switch (mode) {
      case "json":
        this.restoreJson(params as TRestoreParamsJson);
        break;

      case "singleDump":
        this.restoreSingleDump(params as TRestoreParamsDump);
        break;
      default:
        break;
    }
  }
}
// new db().dump({mode:'json',sourceToMongoExportExe})
export default new db();
