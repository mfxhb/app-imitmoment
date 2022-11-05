const request = require('../conf/request')

// 获取用户信息
export const userInfoApi = (isLoading = false) => request.get('/circle/userinfo', { custom: { loading: isLoading } })

// 更新背景
export const updateBGApi = file => request.upload('/circle/updateBG', file)

// 更新头像
export const updateProfileApi = file => request.upload('/circle/updateProfile', file)

// 上传一张图片
export const uploadFileApi = file => request.upload('/img/upload', file)

// 删除单张图片
export const deleteFileApi = filepath => request.post('/img/delFile', { path: filepath })

// 更新图片id
export const updateImgId = () => request.post('/img/updateId')

// 获取说说内容
export const readCirDataApi = () => request.get('/circle/getcir')

// 上传一条说说
export const uploadCirApi = params => request.post('/circle/newcir', params)

// 删除一条说说
export const deleteCirApi = id => request.post('/circle/delcir', { id })
