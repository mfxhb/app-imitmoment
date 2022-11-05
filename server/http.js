/*
 * @Author: BORING GHOST
 * @Date: 2022-08-01 08:40:11
 * @LastEditTime: 2022-08-10 10:01:42
 * @Description:
 */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const { returnPath } = require("./utils/Path.config");

// post数据处理
const { installBodyParser } = require("./serve/bodyParser");
installBodyParser(app, bodyParser);

// 注入全局方法
const installGlobalFn = require("./utils/global");
installGlobalFn(express);

// 路由服务
app.use("/circle", require("./router/circle/index")(express, path));
app.use("/img", require("./router/img/index")(express, path));
app.use("/project", require("./router/project/index")(express, path));

//释放静态资源
app.use("/def", express.static(returnPath("userDefaultImg")));
app.use("/images", express.static(returnPath("otherImg")));

// 启动服务
require("./serve/serve.js")(app);
