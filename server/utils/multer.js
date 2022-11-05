/*
 * @Author: BORING GHOST
 * @Date: 2022-08-01 08:40:11
 * @LastEditTime: 2022-08-01 09:49:48
 * @Description:
 */
const multer = require("multer");
const { readFile, writeFile } = require("./file");
const { returnPath } = require("./Path.config");
const IdFilePath = returnPath("idTxt");

// 读取id,如果没有id就自动创建
function readId() {
  return new Promise(async (resolve, reject) => {
    let result = await readFile(IdFilePath);
    if (!result) {
      const newId = Date.now();
      await writeFile(IdFilePath, newId);
      result = newId;
    }
    resolve(result);
  });
}

module.exports = {
  createMulter(path) {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path);
      },
      filename: async function (req, file, cb) {
        const id = await readId();
        const originalname = file.originalname;
        let cbfilename = id ? id + "-" + originalname : originalname;
        cb(null, cbfilename);
      },
    });

    return multer({ storage: storage });
  },
};
