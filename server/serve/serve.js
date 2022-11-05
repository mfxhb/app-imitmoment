/*
 * @Author: BORING GHOST
 * @Date: 2022-08-01 08:40:11
 * @LastEditTime: 2022-08-01 11:25:52
 * @Description:
 */
module.exports = function (app, port = 8989) {
  app.listen(port, function () {
    const serve = this;
    let host = serve.address().address;
    let port = serve.address().port;
    host = host === "::" ? "127.0.0.1" : host;
    console.log("服务启动成功:http://" + host + ":" + port);
  });
};
