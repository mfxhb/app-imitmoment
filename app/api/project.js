const request = require('../conf/request')

// 获取所有的项目数据
export const readProjectApi = () => request.get('/project/readProjectInfo')

// 新增一项项目数据
export const addProjectInfoItemApi = form => request.post('/project/addProject', form)
