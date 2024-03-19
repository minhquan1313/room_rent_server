import { deleteUploadedTempFile } from "@/Utils/deleteUploadedTempFile";
import { errorResponse } from "@/Utils/errorRes";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export async function ValidateMiddleware(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  // fail
  res.status(StatusCodes.BAD_REQUEST).json(errorResponse("403001", errors.array()));
}
export async function ValidateHasUploadFilesMiddleware(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  // fail
  deleteUploadedTempFile(req);
  res.status(StatusCodes.BAD_REQUEST).json(errorResponse("403001", errors.array()));
}
