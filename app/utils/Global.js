const network = require('../conf/http')

module.exports = {
	install: function(vm) {
		vm.prototype.$baseURL = network['baseurl']
	}
}
