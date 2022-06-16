# 项目介绍
本项目为聊天室后端，前端地址为https://github.com/15933111693/VueChatroom_fr 。

项目使用nodejs + mysql开发。 

项目使用koa-generator和sequelize-cli生成，在此基础上进行开发。

# 如何启动它
```
npm install
npm start
```
或者
```
yarn install
yarn start
```
# 所用框架
* koa
* sequelize
* socket.io
# 功能
1. 用户的登录注册，以及修改用户名、密码, 以及用户头像等。
2. 与客户端建立websocket连接，供用户在聊天室及时接收消息和发送消息。
3. 用户可以创建聊天室和加入聊天室。