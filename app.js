const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
// const bodyParse = require('koa-body')
const logger = require('koa-logger')
const cors = require('koa2-cors')

const index = require('./routes/index')
const user = require('./routes/user')
const chatRoom = require('./routes/chatroom')

// db
const db = require('./models/index')

// param判断
const isParams = require('./params/index')

// service
const service = require('./service/index')

// jwt
const authorize = require('./middle/authorize')

// error handler
onerror(app)

app.use(
  cors({
      origin: function(ctx) { //设置允许来自指定域名请求
          return 'http://192.168.43.101:8080'; //只允许http://localhost:8080这个域名的请求
      },
      maxAge: 5, //指定本次预检请求的有效期，单位为秒。
      credentials: true, //是否允许发送Cookie
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
      allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'token', 'tokenTime'], //设置服务器支持的所有头信息字段
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'token', 'tokenTime'] //设置获取其他自定义字段
  })
);


// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(isParams)

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// 添加db
app.context.db = db
// service层处理
app.context.service = service(db)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// jwt鉴权
app.use(authorize)

// routes
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(chatRoom.routes(), chatRoom.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

// ps: next函数为异步函数