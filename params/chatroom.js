const reg = require('./reg')
module.exports = {
  // create: {
  //   roomName: {
  //     isRequired: true,
  //     regValid: reg.chatRoomName,
  //     validFailedMsg: '房间名称格式错误, 请输入1到10位任意字符'
  //   }
  // },
  create: null,
  addMsg: {
    content: {
      isRequired: true,
      regValid: reg.chatContent,
      validFailedMsg: '对话不能超过50个字'
    },
    CID: {
      isRequired: true,
      regValid: reg.CID,
      validFailedMsg: 'CID格式错误'
    }
  },
  getMsgList: {
    CID: {
      type: 'string',
      isRequired: true,
      regValid: reg.CID,
      validFailedMsg: 'CID格式错误'
    },
    limit: {
      type: 'number',
      isRequired: true,
      regValid: (num) => Number.isInteger(num) && num >= 0,
      validFailedMsg: '限制条数必须为正整数'
    },
    offset: {
      type: 'number',
      isRequired: true,
      regValid: (num) => Number.isInteger(num) && num >= 0,
      validFailedMsg: '偏移量必须为正整数'
    }
  },
  joinNewRoom: {
    CID: {
      isRequired: true,
      regValid: reg.CID,
      validFailedMsg: 'CID格式错误'
    }
  },
  getAllRoom: null,
  test: null
}