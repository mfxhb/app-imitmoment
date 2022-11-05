/*
 * @Author: BORING GHOST
 * @Date: 2022-08-01 09:01:27
 * @LastEditTime: 2022-08-02 15:26:11
 * @Description:
 */

// 静态资源路径管理
const path = require("path");

function pathJoin(str) {
  if (!str || typeof str !== "string") throw new Error();
  return path.join(__dirname, str);
}

/**
 *静态资源路径管理 key:string
 * @idTxt : 图片id的txt文件
 * @userInfoTxt : 朋友圈用户信息
 * @userDefaultImg : 没有背景头像时用来默认显示的图片
 * @otherImg : 其它图片存放的位置
 * @cirImgs : 朋友圈的图片
 * @cirTxt 说说内容数据
 */
function returnPath(key) {
  if (!key || typeof key !== "string") throw new Error();
  return {
    userDefaultImg: pathJoin("../static/default"),
    otherImg: pathJoin("../static/images"),
    cirImgs: pathJoin("../static/images/cirs"),
    idTxt: pathJoin("../data/id.txt"),
    userInfoTxt: pathJoin("../data/circle/userinfo.txt"),
    cirTxt: pathJoin("../data/circle/cirs.txt"),
  }[key];
}

module.exports = {
  returnPath,
};
