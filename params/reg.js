// 已被自动导入除外
// 主要用来写验证数据格式的东西, 可以为正则表达式或者函数(函数形式只能返回true或者false)
const { checkCidFormat } = require('../utils/convertCID')
module.exports = {
  account: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
  password: /^[a-zA-Z0-9]{6,8}$/,
  userName: /^[a-z0-9_-]{3,15}$/,
  url: /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/,
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  chatRoomName: (str) => 1 <= str.length && str.length <= 10,
  chatContent: (str) => 1 <= str.length && str.length <= 50,
  CID: checkCidFormat,
}