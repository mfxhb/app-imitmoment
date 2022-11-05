/*
 * @Author: BORING GHOST
 * @Date: 2022-08-09 22:24:18
 * @LastEditTime: 2022-08-10 17:21:59
 * @Description:
 */
const { KeyNames, descriptsValueKey } = require("./config"); // 数据键名枚举
const { readFile, writeFile } = require("../../utils/file");

/**
 * @addProjectApi 添加一条项目数据
 * @readProjectInfoApi 查看所有项目数据
 * @delProjectInfoApi 删除某项数据
 */
function createRoutes(express, path) {
  // 资源
  const projectInfoTxtPath = path.join(
    __dirname,
    "../../data/project/projectInfo.txt"
  );
  // T 1. 添加一条项目数据
  async function addProjectApi(req, res) {
    try {
      let body = req.body;
      // 除了id其它属性必须有
      const { idKey, ...requiredKey } = KeyNames;
      if (express.Global.isHaveAttri(body, Object.values(requiredKey))) {
        // T 1. 权限校验
        if (express.Global.isNull(body[KeyNames.timeKey]))
          return res.status(501).json("验证失败");
        if (express.Global.isNull(body[KeyNames.typeKey]))
          return res.status(501).json("验证失败");
        if (express.Global.isNull(body[KeyNames.titleKey]))
          return res.status(501).json("验证失败");
        // 并且有描述数据时他内部的键名也要一致
        body[KeyNames.descriptsKey] = express.Global.isTypeTheValue(
          body[KeyNames.descriptsKey],
          "Array",
          []
        );
        // TODO :
        if (
          body[KeyNames.descriptsKey].length > 0 &&
          !express.Global.isHaveAttri(body[KeyNames.descriptsKey][0], [
            descriptsValueKey.textKey,
            descriptsValueKey.titleKey,
          ])
        ) {
          return res.status(501).json("验证失败");
        }
        body[KeyNames.tagsKey] = express.Global.isTypeTheValue(
          body[KeyNames.tagsKey],
          "Array",
          []
        );
        // T 2. 完全通过
        let result = await readFile(projectInfoTxtPath);
        const currentData = {
          [KeyNames.idKey]: Date.now(),
          [KeyNames.typeKey]: body[KeyNames.typeKey],
          [KeyNames.timeKey]: body[KeyNames.timeKey],
          [KeyNames.descriptsKey]: body[KeyNames.descriptsKey],
          [KeyNames.titleKey]: body[KeyNames.titleKey],
          [KeyNames.tagsKey]: body[KeyNames.tagsKey],
        };
        result = result ? result : [];
        result.unshift(currentData);
        await writeFile(projectInfoTxtPath, result);
        res.status(200).json({ data: currentData });
      } else {
        res.status(501).json("验证失败");
      }
    } catch (error) {
      res.status(501).json("操作失败");
    }
  }
  // T. 2. 查看所有项目数据
  async function readProjectInfoApi(req, res) {
    try {
      const result = await readFile(projectInfoTxtPath);
      res.status(200).json({ data: result || [] });
    } catch (error) {
      res.status(501).json("操作失败");
    }
  }
  // T. 3. 删除某个项目
  async function delProjectInfoApi(req, res) {
    try {
      const body = req.body;
      if (!express.Global.isHaveAttri(body, [KeyNames.idKey]))
        return res.status(501).json("缺少参数");
      const id = body[KeyNames.idKey];
      let result = await readFile(projectInfoTxtPath);
      result = result ? result : [];
      const index = result.findIndex((v) => v[KeyNames.idKey] == id);
      if (index < 0) return res.status(501).json("当前项不存在~");
      result.splice(index, 1);
      await writeFile(projectInfoTxtPath, result);
      res.status(200).json({ data: "删除成功~" });
    } catch (error) {
      res.status(501).json("操作失败");
    }
  }
  return {
    addProjectApi,
    readProjectInfoApi,
    delProjectInfoApi,
  };
}

module.exports = createRoutes;
