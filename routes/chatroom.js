const router = require('koa-router')()
const bodyParse = require('koa-body')
const config = require('../config')

router.prefix('/chatroom')

router.post('/create', bodyParse({
  multipart: true,
  formidable: {
    keepExtensions: true,
    uploadDir: config.upload
  }
}), async ({request, response, service}, next) => {
  const { userId, files } = request
  const { roomName } = request.body
  const { chatroom } = service

  const res = await chatroom.createRoom(userId, roomName, files.image ? `${config.host}/images/${files.image.newFilename}` : null)
  response.body = {
    data: {
      name: res.name,
      CID: res.CID
    },
    msg: '创建成功！',
    state: 1
  }
})

router.post('/getAllRoom', async ({request, response, service}, next) => {
  const { userId } = request
  const { chatroom } = service

  const cidList = await chatroom.findAllRoomCidByUserId(userId)

  response.body = {
    data: {
      cidList
    },
    msg: '查询成功！',
    state: 1
  }
})

router.post('/addMsg', async ({request, response, service}, next) => {
  const { userId } = request
  const { content, CID } = request.body
  const { chatroom } = service

  const userInRoom = await chatroom.findOneUserWithRoom(userId, CID)
  if(!userInRoom) {
    return response.body = {
      data: {},
      msg: '该用户不属于此聊天室',
      state: 0
    }
  }

  const res = await chatroom.insertChatList(userId, CID, content)
  return response.body = {
    data: {},
    msg: '发送成功',
    state: 1
  }
})

router.post('/getMsgList', async ({request, response, service}, next) => {
  const { userId } = request
  const { CID, limit, offset } = request.body
  const { chatroom } = service

  const userInRoom = await chatroom.findOneUserWithRoom(userId, CID)
  if(!userInRoom) {
    return response.body = {
      data: {},
      msg: '该用户不属于此聊天室',
      state: 0
    }
  }

  const res = await chatroom.findPartChatListByCid(CID, limit, offset)
  // 如果还有消息
  if(res.length) {
    return response.body = {
      data: {
        msgList: res
      },
      msg: '发送成功',
      state: 1
    }
  }
  else {
    return response.body = {
      data: {},
      msg: '没有消息了',
      state: 0
    }
  }
})

router.post('/joinNewRoom', async ({request, response, service}, next) => {
  const { userId } = request
  const { CID } = request.body
  const { user, chatroom } = service

  const res = await chatroom.insertRoomWithUser(userId, CID)
  if(res) {
    response.body = {
      data: {},
      msg: '加入成功',
      state: 1
    }
  }
  else {
    response.body = {
      data: {},
      msg: '加入失败',
      state: 0
    }
  }
})

module.exports = router