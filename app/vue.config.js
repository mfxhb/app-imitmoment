const network = require('./conf/http')
// 修改完需要重启
module.exports = {
	devServer: {
		proxy: {
			'/': {
				target: network['baseurl'],
				changeOrigin: true,
				pathRewrite: { '/': '' },
			}
		}
	}
}
