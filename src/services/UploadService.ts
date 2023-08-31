import { createFolderFsSync } from "@/Utils/createFolderFsSync";
import { moveFileFs } from "@/Utils/moveFileFs";
import { userFolder } from "@/index";
import fs from "fs";
import path from "path";

class UploadService {
  async userFileUpload(file: Express.Multer.File, userId: string) {
    const [fileType] = file.mimetype.split("/");

    const relativeNewPath = path.join(userId, fileType, file.filename);
    const newPath = path.join(userFolder, relativeNewPath);
    createFolderFsSync(path.dirname(newPath));
    await moveFileFs(file.path, newPath);

    return {
      fullPath: newPath,
      relativePath: relativeNewPath,
      srcForDb: "/" + relativeNewPath.replace(/\\/g, "/"),
    };
  }
  unLinkUserFileSync(filePath: string) {
    const p = path.join(userFolder, filePath);
    fs.unlinkSync(p);
  }
}

export default new UploadService();
