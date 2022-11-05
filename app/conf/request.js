const http = uni.$u.http

function mixinConf(config) {
	config.custom = Object.assign({
		auth: false,
		toast: true,
		catch: true,
		loading: true
	}, config.custom || {})
	return config
}

module.exports = {
	upload(path, file, config = {}) {
		config = mixinConf(config)
		config.filePath = file
		config.name = 'file'
		return http.upload(path, config)
	},
	get(path, config = {}) {
		config = mixinConf(config)
		return http.get(path, config)
	},
	post(path, params, config = {}) {
		config = mixinConf(config)
		return http.post(path, params, config)
	}
}
