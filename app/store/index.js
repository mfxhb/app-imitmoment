import Vue from 'vue';
import Vuex from 'vuex';
import getters from './modules/getters';

/* 模块 */
import project from './modules/project';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: { project },
	getters
})


export default store;
