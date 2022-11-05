/*
 * @Author: BORING GHOST
 * @Date: 2022-08-01 10:52:40
 * @LastEditTime: 2022-08-01 11:17:28
 * @Description:
 */
const { installRoute } = require("./module");
const { createMulter } = require("../../utils/multer");
const { returnPath } = require("../../utils/Path.config");
const cirImgsPath = returnPath("cirImgs");
const ImgMulter = createMulter(cirImgsPath);

module.exports = function (express, path) {
  const img = express.Router();
  const { uploadApi, updateIdApi, deleFileApi } = installRoute(express, path);

  // 更新图片存储id
  img.post("/updateId", updateIdApi);

  // 上传单张图片
  img.post("/upload", ImgMulter.array("file", 1), uploadApi);

  // 删除单张图片
  img.post("/delFile", deleFileApi);

  return img;
};
