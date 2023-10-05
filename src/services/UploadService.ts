import { createFolderFsSync } from "@/Utils/createFolderFsSync";
import { moveFileFs } from "@/Utils/moveFileFs";
import { publicStaticUser } from "@/constants/constants";
import fs from "fs";
import path from "path";

export type TUploadFile = {
  fullPath: string;
  relativePath: string;
  srcForDb: string;
};

class UploadService {
  async userAvatarFileUpload({ file, userId }: { file: Express.Multer.File; userId: string }): Promise<TUploadFile> {
    return await this.fileUpload(file, publicStaticUser, "user", userId, "avatar");
  }
  async userRoomImageFileUpload({ file, roomId }: { file: Express.Multer.File; roomId: string }): Promise<TUploadFile> {
    return await this.fileUpload(file, publicStaticUser, "room", roomId);
    // return await this.fileUpload(file, userStaticFolder, "user", userId, "room", roomId);
  }
  async fileUpload(file: Express.Multer.File, dest: string, ...subPath: string[]): Promise<TUploadFile> {
    const [fileType] = file.mimetype.split("/");

    const relative = path.join(...subPath, fileType, file.filename);
    const destination = path.join(dest, relative);

    createFolderFsSync(path.dirname(destination));
    await moveFileFs(file.path, destination);

    return {
      fullPath: destination,
      relativePath: relative,
      srcForDb: "/" + relative.replace(/\\/g, "/"),
    };
  }
  unLinkUserFileSync(srcForDb: string) {
    return this.unLinkFileSync(path.join(publicStaticUser, srcForDb));
  }
  unLinkRoomFileSync(srcForDb: string) {
    return this.unLinkFileSync(path.join(publicStaticUser, srcForDb));
  }

  unLinkUserFolderSync(userId: string) {
    return this.unLinkFolderSync(path.join(publicStaticUser, "user", userId));
  }
  unLinkRoomFolderSync(roomId: string) {
    return this.unLinkFolderSync(path.join(publicStaticUser, "room", roomId));
  }
  unLinkFolderSync(path: string) {
    try {
      fs.rmSync(path, { recursive: true, force: true });

      return true;
    } catch (error) {
      console.log(`🚀 ~ UploadService ~ unLinkFolderSync ~ error:`, error);

      return false;
    }
  }

  unLinkFileSync(path: string) {
    try {
      // console.log(`🚀 ~ UploadService ~ unLinkFileSync ~ path:`, path);

      fs.unlinkSync(path);

      return true;
    } catch (error) {
      console.log(`🚀 ~ UploadService ~ unLinkFileSync ~ error:`, error);

      return false;
    }
  }
}

export default new UploadService();
