/*
 * @Author: BORING GHOST
 * @Date: 2022-08-01 11:25:10
 * @LastEditTime: 2022-08-01 11:29:08
 * @Description:
 */
module.exports = {
  installBodyParser(app, bodyParser) {
    //post数据处理
    app.all("*", function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Content-Type", "application/json;charset=utf-8");
      res.header(
        "Content-Type",
        "application/x-www-form-urlencoded;charset=utf-8"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, GET, DELETE, OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
      );
      if (req.method.toLowerCase() == "options") {
        res.send(200); //让options尝试请求快速结束
      } else {
        next();
      }
    });
    app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );
    app.use(bodyParser.json());
  },
};
