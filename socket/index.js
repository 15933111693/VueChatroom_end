const { verify } = require("../utils/jwt")
const { Server } = require("socket.io")
const { parse } = require('cookie')
const { convertDate } = require("../utils/convertDate")

// {id: {CID: offset}}
const offsetMap = {}
module.exports = (httpServer, app) => {
  const { chatroom, user } = app.context.service
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"],
      credentials: true
    }
  })
  console.log('ws已启动')
  io.on('connection', async (socket) => {
    console.log('connect')
    // 鉴权验证
    const token = socket.handshake.auth.token
    if(token === undefined) {
      console.error('token错误')
      return
    }
    const enToken = await verify(token)
    const { id, userAccount } = enToken
    if(id === undefined || userAccount === undefined) throw new Error('token错误')
    console.log(`${id} ${userAccount} connect`)

    const userInfo = await user.findOneByUserId(id)
    const { userName, avatar } = userInfo
    offsetMap[socket.id] = {}

    socket.on('joinRoom', async() => {

      const roomCidList = await chatroom.findAllRoomCidByUserId(id)
      const chatRooms = []
      for(let roomCid of roomCidList) {
        const { CID } = roomCid
        offsetMap[socket.id][CID] = 0
        socket.join(CID)
        
        const { name, avatar } = await chatroom.findOneChatRoomByCid(CID)

        const room = {
          CID,
          roomAvatar: avatar,
          roomName: name,
          chatList: []
        }
        const msgs = await chatroom.findPartChatListByCid(CID, 10, 0)
        offsetMap[socket.id][CID] += msgs.length
        for(const msg of msgs) {
          const { userId, content, createdAt, id } = msg
          const { avatar, userName } = await user.findOneByUserId(userId)
          room.chatList.push({
            id, userId, avatar, userName, content, createdAt: convertDate(createdAt)
          })
        }
        chatRooms.push(room)
      }
      socket.emit('initChatRoom', { chatRooms })
    })

    socket.on('joinOneRoom', async(data) => {
      const { CID } = data
      const isInsert = await chatroom.insertRoomWithUser(id, CID)
      const room = await chatroom.findOneChatRoomByCid(CID)
      const { name, avatar } = room
      if(room && isInsert) {
        socket.join(CID)
        offsetMap[socket.id][CID] = 0
        const msgs = await chatroom.findPartChatListByCid(CID, 10, offsetMap[socket.id][CID])
        offsetMap[socket.id][CID] += msgs.length

        const data = {
          CID,
          roomName: name,
          roomAvatar: avatar,
          chatList: []
        }
        for(const msg of msgs) {
          const { userId, content, createdAt, id } = msg
          const { avatar, userName } = await user.findOneByUserId(userId)
          data.chatList.push({
            id, CID, userId, avatar, userName, content, createdAt: convertDate(createdAt)
          })
        }

        socket.emit('joinNewRoom', data)
      }
      else socket.emit('joinNewRoom', {})
    })

    socket.on('joinMyCreateRoom', async(data) => {
      const { CID } = data
      const room = await chatroom.findOneChatRoomByCid(CID)
      const { name, avatar } = room
      socket.join(CID)
      offsetMap[socket.id][CID] = 0

      socket.emit('joinMyCreateRoomClient', {
        CID,
        roomName: name,
        roomAvatar: avatar,
        chatList: []
      })
    })

    socket.on('sendMsg', async (data) => {
      // 在这里data做一些处理
      const  { CID, content } = data
      const msg = {
        userName,
        userId: id,
        avatar,
        content,
        CID,
        createdAt: convertDate(new Date())
      }
      await chatroom.insertChatList(id, CID, content)
      for(let i in offsetMap) {
        offsetMap[i][CID]++
      }
      socket.to(CID).emit('getMsg', { msg })
      socket.emit('getMsg', { msg })
    })

    socket.on('getMoreMsg', async (data) => {
      console.log(socket.stableId)
      const { limit, CID } = data
      const msgs = await chatroom.findPartChatListByCid(CID, limit, offsetMap[socket.id][CID])
      offsetMap[socket.id][CID] += msgs.length

      const convertMsgs = []
      for(const msg of msgs) {
        const { userId, content, createdAt, id } = msg
        const { avatar, userName } = await user.findOneByUserId(userId)
        convertMsgs.push({
          id, CID, userId, avatar, userName, content, createdAt: convertDate(createdAt)
        })
      }

      socket.emit('getMoreMsgs', {
        msgs: convertMsgs
      })
    })

    socket.on('leaveRoom', async (data) => {
      const { CID } = data
      await chatroom.leaveRoom(CID, id)
      await socket.emit('leaveRoom', { CID })
      socket.leave(CID)
    })

    socket.on('error', async (err) => {
      console.error(err.message)
      await socket.disconnect()
    })

    socket.on('disconnect', (data) => {
      delete offsetMap[socket.id]
      console.log(`${id} ${userAccount} disconnect`)
    })
  })
}