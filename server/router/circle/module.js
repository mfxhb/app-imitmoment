/*
 * @Author: BORING GHOST
 * @Date: 2022-08-01 09:32:22
 * @LastEditTime: 2022-08-10 10:09:34
 * @Description:
 */

const { readFile, writeFile, deleteFile } = require("../../utils/file");
const { returnPath } = require("../../utils/Path.config");
const userInfoTxtPath = returnPath("userInfoTxt");
const idTxtPath = returnPath("idTxt");
const cirTxtPath = returnPath("cirTxt");
const { JsonKeyNames } = require("./config");

/**
 * @userinfoApi 获取用户信息
 * @updateBGApi 修改用户背景
 * @updateProfileApi 修改用户头像
 * @addNewcirApi 发布新说说
 * @delcirApi 删除说说
 * @readCirDataApi 获取说说数据
 */
function inStallRoute(express, path) {
  const staticLeftPath = (str) => path.join(__dirname, "../../static" + str);
  // T. tool
  const isDelHistoryImg = true; // 是否删除上一张图片
  async function deleteStaticImg(originalname) {
    try {
      if (originalname && isDelHistoryImg) {
        await deleteFile(staticLeftPath(originalname));
      }
    } catch (error) {}
  }
  // T.获取用户信息
  async function userinfoApi(req, res) {
    try {
      let result = await readFile(userInfoTxtPath);
      // 延迟
      setTimeout(() => {
        if (express.Global.isNull(result)) {
          // 没有用户信息就响应默认信息
          res.status(200).json({
            [JsonKeyNames.profile]: "/def/profile.jpg",
            [JsonKeyNames.background]: "/def/bg.jpg",
          });
        } else {
          res.status(200).json(
            Object.assign(
              {
                [JsonKeyNames.profile]: "/def/profile.jpg",
                [JsonKeyNames.background]: "/def/bg.jpg",
              },
              result || {}
            )
          );
        }
      }, 0);
    } catch (e) {
      res.status(501).json("操作失败");
    }
  }
  // T.更新背景
  async function updateBGApi(req, res) {
    try {
      if (req.files[0]["filename"]) {
        //添加成功后跟新到用户信息
        let result = await readFile(userInfoTxtPath);
        result = express.Global.isNull(result) ? {} : result;
        const originalname = result[JsonKeyNames.background] || "";
        await writeFile(
          userInfoTxtPath,
          Object.assign(
            result,
            {
              [JsonKeyNames.background]:
                "/images/BG/" + req.files[0]["filename"],
            } || {}
          )
        );
        originalname && deleteStaticImg(originalname); // Fix:必须在修改成功之后再删除
        res.status(200).json({ bg: "/images/BG/" + req.files[0]["filename"] });
      }
    } catch (e) {
      res.status(501).json("操作失败");
    }
  }
  // T.更新头像
  async function updateProfileApi(req, res) {
    try {
      let filename = req.files[0]["filename"];
      filename = filename ? "/images/Profile/" + filename : "";
      if (filename) {
        let result = await readFile(userInfoTxtPath);
        result = result ? result : {};
        const originalname = result[JsonKeyNames.profile] || "";
        await writeFile(
          userInfoTxtPath,
          Object.assign(result, {
            [JsonKeyNames.profile]: filename,
          })
        );
        originalname && deleteStaticImg(originalname); // Fix:必须在修改成功之后再删除
        res.status(200).json({ [JsonKeyNames.profile]: filename });
      } else {
        res.status(501).json("操作失败");
      }
    } catch (error) {
      res.status(501).json("操作失败");
    }
  }

  // T.添加一条说说
  async function addNewcirApi(req, res) {
    try {
      const data = req.body || {};
      if (
        express.Global.isHaveAttri(data, [
          JsonKeyNames.cirText,
          JsonKeyNames.cirUrls,
        ])
      ) {
        const id = await readFile(idTxtPath);
        if (!id) return res.status(501).json("请重写进入页面~");
        let result = await readFile(cirTxtPath);
        result = result ? result : [];
        result.unshift({
          [JsonKeyNames.cirText]: data[JsonKeyNames.cirText],
          [JsonKeyNames.cirUrls]: data[JsonKeyNames.cirUrls] || [],
          [JsonKeyNames.cirTime]: Date.now(),
          [JsonKeyNames.cirId]: id,
        });
        await writeFile(cirTxtPath, result);
        res.status(200).json({ data: "发布成功" });
      } else {
        res.status(501).json("缺少参数");
      }
    } catch (error) {
      res.status(501).json("操作失败");
    }
  }

  // T.删除说说
  async function delcirApi(req, res) {
    try {
      const body = req.body;
      const idKey = JsonKeyNames.cirId;
      if (express.Global.isHaveAttri(body, [idKey])) {
        let result = await readFile(cirTxtPath);
        result = result ? result : [];
        // Fix: postman是字符串
        if (typeof body[idKey] === "string") {
          body[idKey] = parseFloat(body[idKey]);
        }
        const index = result.findIndex((v) => v[idKey] === body[idKey]);
        if (index >= 0) {
          // 将对应的图片都删除,然后再重写数据
          const currentCirUrls = result[index][JsonKeyNames.cirUrls];
          for (let k = 0, len = currentCirUrls.length; k < len; k++) {
            const itemUrl = currentCirUrls[k];
            try {
              await deleteFile(staticLeftPath(itemUrl));
            } catch (error) {}
          }
          result.splice(index, 1);
          await writeFile(cirTxtPath, result);
          res.status(200).json({ data: "删除成功" });
        } else {
          res.status(501).json("没有这条说说");
        }
      } else {
        res.status(501).json("缺少参数");
      }
    } catch (error) {
      res.status(501).json("操作失败");
    }
  }

  // T.获取说说数据
  async function readCirDataApi(req, res) {
    try {
      let result = await readFile(cirTxtPath);
      result = result ? result : [];
      setTimeout(() => {
        res.status(200).json({ data: result });
      }, 500);
    } catch (error) {
      res.status(501).json("操作失败");
    }
  }

  return {
    userinfoApi,
    updateBGApi,
    updateProfileApi,
    addNewcirApi,
    delcirApi,
    readCirDataApi,
  };
}

module.exports = {
  inStallRoute,
};
