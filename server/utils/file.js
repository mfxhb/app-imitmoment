/*
 * @Author: BORING GHOST
 * @Date: 2022-08-01 08:40:11
 * @LastEditTime: 2022-08-01 11:32:27
 * @Description:
 */
const fs = require("fs");

module.exports = {
  /**
   * 读取文件
   */
  readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, "utf-8", function (err, dataStr) {
        if (err) {
          reject("操作失败");
        } else {
          resolve(JSON.parse(dataStr || JSON.stringify("")));
        }
      });
    });
  },
  /**
   * 写入文件
   */
  writeFile(path, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(data), function (err) {
        if (err) {
          reject("操作失败");
        } else {
          resolve("操作成功");
        }
      });
    });
  },
  /**
   * 删除文件
   */
  deleteFile(path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, function (err) {
        if (err) {
          reject("操作失败");
        } else {
          resolve("操作成功");
        }
      });
    });
  },
};
