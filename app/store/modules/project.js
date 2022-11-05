import { readProjectApi, addProjectInfoItemApi } from '@/api/project.js';
import { isHaveAttributes, isValueTheType } from '@/utils/tool.js';

// TODO 项目数据键名枚举
/**
 * 项目数据存储的键名
 * @idKey id
 * @titleKey 项目名称
 * @typeKey 项目类型
 * @tagsKey 使用过的技术
 * @descriptsKey 功能描述
 */
const projectEnum = {
	titleKey: 'title',
	typeKey: 'type',
	timeKey: 'time',
	tagsKey: 'tags',
	descriptsKey: 'descripts',
}
/**
 * 功能描述值内部的键名
 * @titleKey 标题
 * @textKey 描述内容
 */
const descriptsValueKey = {
	titleKey: 'title',
	textKey: 'text',
};

const state = {
	// 当前所用过的技术
	currentTechnics: [],
	// 所有项目的数据
	projectDataList: [],
}

const mutations = {
	// 添加新技术
	addCurrentTechnics(state, newc) {
		if (typeof newc !== 'string') return false;
		// 如果已经存在相同的值,就将其移动到最前面
		const index = state.currentTechnics.findIndex(v => v === newc);
		if (index !== -1) {
			state.currentTechnics.splice(index, 1);
		}
		state.currentTechnics.unshift(newc);
	},
	// 更新项目数据
	updateProjectDataList(state, data) {
		if (!(Array.isArray(data))) return false;
		state.projectDataList = JSON.parse(JSON.stringify(data))
	},
	// 新增项目数据
	addProjectInfoItem(state, item) {
		if (Object.prototype.toString.call(item) !== '[object Object]') return false;
		state.projectDataList.unshift(item);
	}
}

const actions = {
	// 查看所有项目数据
	async readProjectInfo({ commit }) {
		try {
			const { data } = await readProjectApi()
			if (data) {
				commit('updateProjectDataList', data);
			}
		} catch (e) {
			//TODO handle the exception
		}
	},
	// 添加一个项目数据
	async addProjectInfoItem({ commit }, formP) {
		try {
			let form=JSON.parse(JSON.stringify(formP))
			// T :先校验是否包含对应的一些属性
			if (!isHaveAttributes(form, Object.values(projectEnum))) {
				console.log('属性校验失败~', Object.values(projectEnum))
				return false
			};
			// T :tags跟项目描述必须为数组,如果不是赋值为空数组
			form[projectEnum.tagsKey] = isValueTheType(form[projectEnum.tagsKey], 'Array', []);
			form[projectEnum.descriptsKey] = isValueTheType(form[projectEnum.descriptsKey], 'Array', []);
			// T : 描述内部结构的数据,是否有响应的属性
			if (form[projectEnum.descriptsKey].length > 0) {
				if (!isHaveAttributes(form[projectEnum.descriptsKey][0], Object.values(descriptsValueKey))) {
					form[projectEnum.descriptsKey] = [];
				};
			}
			const { data } = await addProjectInfoItemApi(form)
			// 添加成功~
			commit('addProjectInfoItem', data);
			return true
		} catch (e) {
			//TODO handle the exception
		}
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
