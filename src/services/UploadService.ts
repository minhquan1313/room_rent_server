import { createFolderFsSync } from "@/Utils/createFolderFsSync";
import { moveFileFs } from "@/Utils/moveFileFs";
import { userStaticFolder } from "@/index";
import fs from "fs";
import path from "path";

export type TUploadFile = {
  fullPath: string;
  relativePath: string;
  srcForDb: string;
};

class UploadService {
  async userAvatarFileUpload(file: Express.Multer.File, userId: string): Promise<TUploadFile> {
    return await this.fileUpload(file, userStaticFolder, "user", userId, "avatar");
  }
  async userRoomImageFileUpload(file: Express.Multer.File, userId: string, roomId: string): Promise<TUploadFile> {
    return await this.fileUpload(file, userStaticFolder, "room", roomId);
    // return await this.fileUpload(file, userStaticFolder, "user", userId, "room", roomId);
  }
  async fileUpload(file: Express.Multer.File, finalPath: string, ...subPath: string[]): Promise<TUploadFile> {
    const [fileType] = file.mimetype.split("/");

    const relative = path.join(...subPath, fileType, file.filename);
    const destination = path.join(finalPath, relative);

    createFolderFsSync(path.dirname(destination));
    await moveFileFs(file.path, destination);

    return {
      fullPath: destination,
      relativePath: relative,
      srcForDb: "/" + relative.replace(/\\/g, "/"),
    };
  }
  unLinkUserFileSync(srcForDb: string) {
    return this.unLinkFileSync(path.join(userStaticFolder, srcForDb));
  }
  unLinkFileSync(path: string) {
    try {
      console.log(`🚀 ~ UploadService ~ unLinkFileSync ~ path:`, path);

      fs.unlinkSync(path);

      return true;
    } catch (error) {
      console.log(`🚀 ~ UploadService ~ unLinkFileSync ~ error:`, error);

      return false;
    }
  }
}

export default new UploadService();
