const router = require('koa-router')()
const fs = require('fs')

// 防止异步返回404

router.get('/chatroom/test', async ({db, request, response, render}, next) => {
  await render('index.html', {
    title: 'Hello Koa 2!'
  })
  // const file = fs.readFileSync('../views/index.html')
  // response.body = file
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
