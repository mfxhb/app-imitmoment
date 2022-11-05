/*
 * @Author: BORING GHOST
 * @Date: 2022-08-01 08:40:11
 * @LastEditTime: 2022-08-03 10:08:41
 * @Description:
 */
const { createMulter } = require("../../utils/multer");
const { inStallRoute } = require("./module");

module.exports = function (express, path) {
  const {
    userinfoApi,
    updateBGApi,
    updateProfileApi,
    addNewcirApi,
    delcirApi,
    readCirDataApi,
  } = inStallRoute(express, path);
  const circle = express.Router();
  const BGMulter = createMulter(path.join(__dirname, "../../static/images/BG"));
  const ProfileMulter = createMulter(
    path.join(__dirname, "../../static/images/Profile")
  );

  // 获取用户信息
  circle.get("/userinfo", userinfoApi);
  // 更新背景
  circle.post("/updateBG", BGMulter.array("file", 1), updateBGApi);
  // 更新头像
  circle.post(
    "/updateProfile",
    ProfileMulter.array("file", 1),
    updateProfileApi
  );
  // 发布一条新的说说
  circle.post("/newcir", addNewcirApi);
  // 删除一条新的说说
  circle.post("/delcir", delcirApi);
  // 获取说说数据
  circle.get("/getcir", readCirDataApi);
  return circle;
};
