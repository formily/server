# formily server

Koa.js + MongoDB


## 服务器 linux 安装 mongodb

[mongodb 怎么部署到 linux/centeros 安装 mongodb](https://fe.zuo11.com/daily/2023-01.html#mongodb-%E6%80%8E%E4%B9%88%E9%83%A8%E7%BD%B2%E5%88%B0-linux-centeros-%E5%AE%89%E8%A3%85-mongodb)

## Mongodb 数据库/集合

```bash
# 连接/创建数据库, use 数据库名称
use formily


```

### collection

#### configList

```bash
# 创建集合
db.createCollection('configList')
```

#### user 用户模块

```bash
# 创建集合
db.createCollection('user')

# 插入用户数据，公共测试账号 { name: 'admin', password: 'admin' }
db.user.insertMany([ { name: 'admin', password: 'admin' },{ name: 'dev-zuo', password: '123456' }] )

# 修改 个人账号 私有账号密码
db.user.update({'name':'dev-zuo'},{$set:{'password':'新密码'}})
```
