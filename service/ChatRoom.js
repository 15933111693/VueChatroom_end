const DB = require('./DB')
const { cidConvertInt } = require('../utils/convertCID')

class ChatRoom extends DB {
  constructor(db) {
    super(db)
    this.room = this.db.room
    this.roomWithUser = this.db.roomWithUser
    this.chatList = this.db.chatList
    this.roomId = this.db.roomId
    this.roomIdInstance = null
    this.nextId
  }

  async getRoomInstance() {
    if(this.roomIdInstance) return this.roomIdInstance

    const res = await this.roomId.findAll()
    if(res.length === 0) {
      this.roomIdInstance = await this.roomId.create({
        nextId: 1
      })
      this.nextId = 1
    }
    else {
      this.roomIdInstance = res[0]
      this.nextId = cidConvertInt(this.roomIdInstance.nextId)
    }
    return this.roomIdInstance
  }

  async createRoom(userId, roomName, avatar) {
    const roomIdInstance = await this.getRoomInstance()

    const data = {
      CID: this.nextId, 
      name: roomName
    }
    if (avatar) data.avatar = avatar
    const roomInstance = await this.room.create(data)
    const roomWithUser = await this.roomWithUser.create({
      userId,
      roomId: roomInstance.id,
      CID: this.nextId
    })
    
    // nextId + 1
    await roomIdInstance.increment({
      nextId: 1
    })
    this.nextId++
    return roomInstance
  }

  async findOneUserWithRoom(userId, CID) {
    const res = await this.roomWithUser.findOne({
      where: {
        userId,
        CID: cidConvertInt(CID)
      }
    })
    return res ? true : false
  }

  async findOneChatRoomByCid(CID) {
    const res = await this.room.findOne({
      where: {
        CID: cidConvertInt(CID)
      }
    })
    return res
  }

  async findAllRoomCidByUserId(userId) {
    const res = await this.roomWithUser.findAll({
      where: {
        userId
      }
    })
    return res.length ? res : []
  }

  async insertChatList(userId, CID, content) {
    const res = await this.chatList.create({
      userId, CID, content
    })
    return res
  }

  async findPartChatListByCid(CID, limit, offset) {
    const res = await this.chatList.findAll({
      order: [['createdAt', 'DESC']],
      where: {
        CID: cidConvertInt(CID)
      },
      limit,
      offset
    })
    return res
  }

  async insertRoomWithUser(userId, CID) {
    const isInRoom = await this.roomWithUser.findOne({
      where: {
        CID: cidConvertInt(CID),
        userId
      }
    })
    if(isInRoom) return false
    const { id } = await this.room.findOne({
      where: {
        CID: cidConvertInt(CID)
      }
    })
    const roomId = id
    const res = this.roomWithUser.create({
      roomId, userId, CID: cidConvertInt(CID)
    })
    return res ? true : false
  }

  async leaveRoom(CID, userId) {
    await this.roomWithUser.destroy({
      where: {
        CID: cidConvertInt(CID),
        userId
      }
    })
  }
}

module.exports = ChatRoom