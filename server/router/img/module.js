/*
 * @Author: BORING GHOST
 * @Date: 2022-08-01 10:53:49
 * @LastEditTime: 2022-08-02 14:56:59
 * @Description:
 */

const { writeFile, deleteFile } = require("../../utils/file");
const { returnPath } = require("../../utils/Path.config");
const idTxtPath = returnPath("idTxt");

/**
 *@updateIdApi 更新图片id
 *@uploadApi 上传单张图片
 *@deleFileApi 删除单张图片
 */
function installRoute(express, path) {
  const cirStrLeftPath = path.join(__dirname, "../../static");
  //T .1
  async function deleFileApi(req, res) {
    try {
      const imgPath = req.body.path || "";
      if (imgPath) {
        await deleteFile(cirStrLeftPath + imgPath);
        res.status(200).json({ data: "删除成功" });
      } else {
        res.status(501).json("没有这张图片");
      }
    } catch (error) {
      res.status(501).json("没有这张图片");
    }
  }
  //T .2
  async function updateIdApi(req, res) {
    try {
      const newId = Date.now();
      await writeFile(idTxtPath, newId);
      res.status(200).json({ data: "更新成功", id: newId });
    } catch (error) {
      res.status(501).json("更新失败");
    }
  }
  //T .3
  async function uploadApi(req, res) {
    try {
      const newFilename = req.files[0]["filename"];
      if (newFilename) {
        res.status(200).json({ url: "/images/cirs/" + newFilename });
      } else {
        res.status(501).json("操作失败");
      }
    } catch (error) {
      res.status(501).json("操作失败");
    }
  }

  return {
    updateIdApi,
    uploadApi,
    deleFileApi,
  };
}

module.exports = {
  installRoute,
};
