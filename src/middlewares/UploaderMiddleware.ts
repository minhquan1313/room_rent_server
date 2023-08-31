import { createFolderFsSync } from "@/Utils/createFolderFsSync";
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
export default UploaderMiddleware;
