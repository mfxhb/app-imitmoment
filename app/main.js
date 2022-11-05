import App from './App'

import Vue from 'vue'

// main.js
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

// store
import store from '@/store/index.js'

const Global = require('./utils/Global')
Vue.use(Global)

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})

require('./conf/intercptors')(app)

app.$mount()
