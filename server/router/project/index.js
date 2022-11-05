/*
 * @Author: BORING GHOST
 * @Date: 2022-08-09 22:22:25
 * @LastEditTime: 2022-08-10 14:09:17
 * @Description:
 */
const createRoutes = require("./module");

module.exports = function (express, path) {
  const project = express.Router();
  const { addProjectApi, readProjectInfoApi, delProjectInfoApi } = createRoutes(
    express,
    path
  );
  // 添加一条项目数据
  project.post("/addProject", addProjectApi);
  // 查看所有的项目数据
  project.get("/readProjectInfo", readProjectInfoApi);
  // 删除某一个项目
  project.post("/delProjectInfo", delProjectInfoApi);

  return project;
};
