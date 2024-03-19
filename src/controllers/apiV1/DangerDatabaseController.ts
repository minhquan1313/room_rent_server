import db from "@/config/db";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class DangerDatabaseController {
  async getRestoreJson(req: Request, res: Response, next: NextFunction) {
    try {
      const { sourceToJsonFolder, sourceToMongoImportExe } = req.query;

      if (typeof sourceToJsonFolder !== "string" || typeof sourceToMongoImportExe !== "string") {
        res.status(StatusCodes.BAD_REQUEST).send(`bad request`);
        return;
      }

      await db.restoreJson({ mode: "json", sourceToJsonFolder, sourceToMongoImportExe });
      res.send(`success`);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`failure`);
    }
  }
  async getRestoreDump(req: Request, res: Response, next: NextFunction) {
    try {
      const { sourceToDumpFile, sourceToMongoRestoreExe } = req.query;

      if (typeof sourceToDumpFile !== "string" || typeof sourceToMongoRestoreExe !== "string") {
        res.status(StatusCodes.BAD_REQUEST).send(`bad request`);
        return;
      }

      await db.restoreSingleDump({ mode: "singleDump", sourceToDumpFile, sourceToMongoRestoreExe });
      res.send(`success`);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`failure`);
    }
  }

  async getExportJson(req: Request, res: Response, next: NextFunction) {
    try {
      const { sourceToMongoExportExe } = req.query;

      if (typeof sourceToMongoExportExe !== "string") {
        res.status(StatusCodes.BAD_REQUEST).send(`bad request`);
        return;
      }

      await db.dumpJson({ mode: "json", sourceToMongoExportExe });
      res.send(`success`);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`failure`);
    }
  }

  async getExportDump(req: Request, res: Response, next: NextFunction) {
    try {
      const { sourceToMongoDumpExe } = req.query;

      if (typeof sourceToMongoDumpExe !== "string") {
        res.status(StatusCodes.BAD_REQUEST).send(`bad request`);
        return;
      }

      await db.dumpSingleDump({ mode: "singleDump", sourceToMongoDumpExe });
      res.send(`success`);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`failure`);
    }
  }
}

export default new DangerDatabaseController();
