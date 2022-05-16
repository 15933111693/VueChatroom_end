const DB = require('./DB')

class User extends DB{
  constructor(db) {
    super(db)
    this.user = this.db.user
  }
  async insertOne({ userAccount, userPwd, userName }) {
    const res = await this.user.create({
      userAccount,
      userPwd,
      userName: userName === undefined ? userAccount : userName
    })
    return res
  }
  async findOneByAccount(userAccount) {
    const user = await this.user.findOne({
      where: {userAccount}
    })
    if(!user) return null
    return user
  }
  async findOneByUserId(userId) {
    const user = await this.user.findOne({
      where: {id: userId}
    })
    if(!user) return null
    return user
  }
  async findOneByAccountAndPwd(userAccount, userPwd) {
    const user = await this.findOneByAccount(userAccount)
    if(!user) return null
    if(userPwd !== user.userPwd) return null
    return user
  }
  async updateUserName(userId, userName) {
    const res = await this.user.update({userName}, {
      where: {
        id: userId
      }
    })
    return res
  }
  async updateUserPwd(userId, userPwd) {
    const res = await this.user.update({userPwd}, {
      where: {
        id: userId
      }
    })
    return res
  }
  async updateUserAvatar(userId, avatar) {
    const res = await this.user.update({avatar}, {
      where: {
        id: userId
      }
    })
    return res
  }
}
module.exports = User