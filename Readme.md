`app` : 前端项目
`server` : node 服务

# 拉取代码

```
git clone -b master git@gitee.com:isAllyn/app-for-mobile-recording.git BlogApp
```

# 启动

1. 启动前端

```
app目录使用HbuilderX运行就可以了
```

注意: conf 目录下 http.js 中的 ip 是否与自己电脑 ip 一致

2. 启动 node 服务

`安装依赖`

```
pnpm i
```

`运行`

```
pnpm dev
```

注意: 没有 pnpm 时`npm i -g pnpm`需要全局安装一个

```
npm i -g pnpm
```
