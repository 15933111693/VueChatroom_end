const { verify } = require('../utils/jwt')
const isExpectedPath = require('../utils/isExpectedPath')

// 需要验证token的路径树
const includePath = {
  chatroom: {
    create: true,
    addMsg: true,
    getMsgList: true,
    getAllRoom: true,
    joinNewRoom: true
  },
  user: {
    modifyUserName: true,
    modifyUserPwd: true,
    modifyUserAvatar: true
  }
}

module.exports = async ({ request, response, cookies }, next) => {
  const token = request.get('token')
  const { path } = request
  if(isExpectedPath(path, includePath)) {
    // token
    const tokenByCookie = cookies.get('token')
    const key = await verify(token)
    const keyByCookie = await verify(tokenByCookie)
    if(!key && !keyByCookie) {
      return response.body = {
        data: {},
        msg: '您没有权限',
        state: 0
      }
    }
    else {
      request.userId = key.id || keyByCookie.id
    }
  }
  await next()
}