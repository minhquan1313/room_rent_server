import fs from "fs";

export function moveFileFs(oldPath: string, newPath: string) {
  return new Promise<void>((rs, rj) => {
    fs.rename(oldPath, newPath, function (err) {
      if (err) {
        if (err.code === "EXDEV") {
          copy();
        } else {
          rj(err);
          //   callback(err);
        }
      }
      //   callback();
      return rs();
    });

    function copy() {
      var readStream = fs.createReadStream(oldPath);
      var writeStream = fs.createWriteStream(newPath);

      readStream.on("error", rj);
      writeStream.on("error", rj);

      readStream.on("close", function () {
        fs.unlink(oldPath, rj);
      });

      readStream.pipe(writeStream);
    }
  });
}
