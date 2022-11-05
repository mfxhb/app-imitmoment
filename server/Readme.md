### 接口

- circle朋友圈
1. 
`Get: 获取用户信息`
```
/circle/userinfo
```
2. 
`Post: 修改用户背景`
> 二进制文件blob,  name为'file'
```
/circle/updateBG
```
3. 
`Post: 修改用户头像`
> 二进制文件blob, name为'file'
```
/circle/updateProfile
```

- 图片相关接口
1. 
`Post: 更新图片id`
> 不需要传参
```
/img/updateId
```

2. 
`Post: 上传单张图片`
> 二进制文件blob,  name为'file'
```
/img/upload
```

3. 
`Post: 删除单张图片`
> path:接口响应的图片地址
```
/img/delFile
```


### 功能

1. 朋友圈

> 1. 朋友圈的背景为页面的背景,只不过占位是在top位置
> 2. 再通过手指滑动的监听来更改内容区的top属性值

2. 图片上传

> 每次上传图片都是以 id-filename的格式保存,这个id是为了更好的管理图片

