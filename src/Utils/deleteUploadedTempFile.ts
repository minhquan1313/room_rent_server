import UploadService from "@/services/UploadService";
import { Request } from "express";

export function deleteUploadedTempFile(req: Request) {
  const { file, files } = req;

  if (file) {
    UploadService.unLinkFileSync(file.path);
  }

  if (Array.isArray(files)) {
    files?.forEach((file) => {
      UploadService.unLinkFileSync(file.path);
    });
  }
}
