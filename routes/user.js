const router = require('koa-router')()
const { sign, verify } = require('../utils/jwt')
const bodyParse = require('koa-body')
const config = require('../config')

router.prefix('/user')
router.post('/create', async ({request, response, service}, next) => {
  const { user } = service
  const { userAccount, userPwd, userName } = request.body
  const onlyOne = await user.findOneByAccount(userAccount)
  if(onlyOne !== null) {
    return response.body = {
      data: {},
      msg: '已有相同账户',
      state: 0
    }
  }
  const res = await user.insertOne({
    userAccount,
    userPwd,
    userName
  })
  return response.body = {
    body: {},
    msg: res ? '创建成功' : '创建失败',
    state: res ? 1 : 0
  }
})

router.post('/login', async ({request, response, service, cookies}, next) => {
  const { user } = service
  const { userAccount, userPwd } = request.body
  const res = await user.findOneByAccountAndPwd(userAccount, userPwd)
  if(res) {
    // 将密码清空
    res.userPwd = null

    // 设置token
    const token = await sign({userAccount, id: res.id})
    cookies.set('token', token, { maxAge: 1000 * 60 * 60 * 24 * 30 })
    response.set('token', token)
    response.set('tokenTime', 1000 * 60 * 60 * 24 * 30)

    return response.body = {
      data: res,
      msg: "登录成功",
      state: 1
    }
  }
  else {
    return response.body = {
      data: {},
      msg: "用户名或密码错误",
      state: 0
    }
  }
})


router.post('/modifyUserName', async ({request, response, service}, next) => {
  const { userId } = request
  const { user } = service
  const { userName } = request.body
  const res = await user.updateUserName(userId, userName)
  if(res) {
    response.body = {
      data: {},
      msg: '修改成功',
      state: 1
    }
  }
  else {
    response.body = {
      data: {},
      msg: '修改用户名发生错误',
      state: 0
    }
  }
})

router.post('/modifyUserPwd', async ({request, response, service}, next) => {
  const { userId } = request
  const { user } = service
  const { userPwd } = request.body
  const res = await user.updateUserPwd(userId, userPwd)
  if(res) {
    response.body = {
      data: {},
      msg: '修改成功',
      state: 1
    }
  }
  else {
    response.body = {
      data: {},
      msg: '修改密码发生错误',
      state: 0
    }
  }
})

router.post('/modifyUserAvatar', bodyParse({
  multipart: true,
  formidable: {
    keepExtensions: true,
    uploadDir: config.upload
  }
}), async ({request, response, service}, next) => {
  const { userId, files } = request
  const { user } = service

  const image = files.image
  const imgsrc = `${config.host}/images/${image.newFilename}`


  const res = await user.updateUserAvatar(userId, imgsrc)
  if(res) {
    response.body = {
      data: { avatar: imgsrc },
      msg: '修改成功',
      state: 1
    }
  }
  else {
    response.body = {
      data: {},
      msg: '修改头像发生错误',
      state: 0
    }
  }
})
module.exports = router
