import DangerDatabaseController from "@/controllers/apiV1/DangerDatabaseController";
import { Router } from "express";

// /api/v1/dangerDatabase
const router = Router();

// router.get("/this/is/very/long/route/restoreJson", DangerDatabaseController.getRestoreJson);
router.get("/this/is/very/long/route/restoreDump", DangerDatabaseController.getRestoreDump);

router.get("/this/is/very/long/route/exportJson", DangerDatabaseController.getExportJson);
router.get("/this/is/very/long/route/exportDump", DangerDatabaseController.getExportDump);

export { router as dangerDatabaseV1Router };
