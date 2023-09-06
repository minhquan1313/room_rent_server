import { createFolderFsSync } from "@/Utils/createFolderFsSync";
import { errorResponse } from "@/Utils/errorRes";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import multer, { diskStorage } from "multer";
import path from "path";

const des = path.join(process.cwd(), "temp");
createFolderFsSync(des);

const UploaderMiddleware = multer({
  storage: diskStorage({
    destination(req, file, callback) {
      callback(null, des);
    },
    filename(req, file, callback) {
      const extName = path.extname(file.originalname);
      const name = path.basename(file.originalname, extName) + "_" + new Date().getTime().toString() + "_" + Math.ceil(Math.random() * 100000).toString() + extName;

      callback(null, name);
    },
  }),
});

// https://stackoverflow.com/questions/65012520/typescript-function-parameter-type-based-on-another-parameter
// Declare a type based on other value param
type MulterFunctions = ReturnType<typeof multer>;
type MulterFunctionKeys = keyof MulterFunctions;
export function UploaderMiddlewareWithJson<T extends MulterFunctionKeys>(type: T, ...fieldName: Parameters<MulterFunctions[T]>) {
  return [
    //@ts-ignore function
    UploaderMiddleware[type](...fieldName),
    (req: Request, res: Response, next: NextFunction) => {
      try {
        const { json } = req.body;
        console.log(`🚀 ~ FromDataJsonMiddleware ~ json:`, json);

        if (!json) return next();

        const jsonP = JSON.parse(json);

        for (const key in jsonP) {
          req.body[key] = jsonP[key];
        }
        // return res.json("x");
        next();
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse(error.toString()));
      }
    },
  ];
}

export default UploaderMiddleware;
