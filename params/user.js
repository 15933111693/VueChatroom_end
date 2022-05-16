const reg = require('./reg')
module.exports = {
  create: {
    userAccount: {
      isRequired: true,
      regValid: reg.account,
      validFailedMsg: '账号格式错误, 请输入6到20位数字或字母组合'
    },
    userPwd: {
      isRequired: true,
      regValid: reg.password,
      validFailedMsg: '密码格式错误, 请输入6到8位数字或字母组合'
    },
    userName: {
      isRequired: false,
      regValid: reg.userName,
      validFailedMsg: '用户名格式错误, 请输入3到15个字符，只能包含小写字符，数字或特殊符号“ _-”'
    }
  },
  login: {
    userAccount: {
      isRequired: true,
      regValid: reg.account,
      validFailedMsg: '账号格式错误, 请输入6到20位数字或字母组合'
    },
    userPwd: {
      isRequired: true,
      regValid: reg.password,
      validFailedMsg: '密码格式错误, 请输入6到8位数字或字母组合'
    }
  },
  modifyUserName: {
    userName: {
      isRequired: true,
      regValid: reg.userName,
      validFailedMsg: '用户名格式错误, 请输入3到15个字符，只能包含小写字符，数字或特殊符号“ _-”'
    }
  },
  modifyUserPwd: {
    userPwd: {
      isRequired: true,
      regValid: reg.password,
      validFailedMsg: '密码格式错误, 请输入6到8位数字或字母组合'
    }
  },
  modifyUserAvatar: null
}