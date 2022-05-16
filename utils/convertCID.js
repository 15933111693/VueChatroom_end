// 做chatID表的映射转换 0 ~ 9 A ~ Z a ~ z
// ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
const intToCid = new Array(62)
const cidToInt = {}
let idx = 0
for (let i = 0; i <= 9; i++) {
  const x = String(i)
  intToCid[idx] = x
  cidToInt[x] = idx
  idx++
}
for (let i = 0; i < 26; i++) {
  const x = String.fromCharCode(65 + i)
  intToCid[idx] = x
  cidToInt[x] = idx
  idx++
}
for (let i = 0; i < 26; i++) {
  const x = String.fromCharCode(97 + i)
  intToCid[idx] = x
  cidToInt[x] = idx
  idx++
}

// 检测cid格式
const checkCidFormat = (cid) => {
  if (cid.length != 10 || cid.slice(0, 3) != 'CID') return false
  for (let i = 3; i < cid.length; i++) {
    if (intToCid.indexOf(cid[i]) == -1) return false
  }
  return true
}

const intConvertCid = (num) => {
  if(num >= 62 ** 7) return 'CID0000000' // 不存在的聊天室
  let res = ''
  for (let i = 0; i < 7; i++) {
    res = intToCid[num % 62] + res
    num = (num - num % 62) / 62
  }
  return 'CID' + res
}

const cidConvertInt = (cid) => {
  if (!checkCidFormat(cid)) {
    console.error("Cid format is not correct!")
    return -1
  }
  let res = 0
  const n = cid.length
  for (let i = 3; i < n; i++) {
    s = cid[i]
    res = res * 62 + cidToInt[s]
  }
  return res
}

module.exports = {
  intConvertCid, cidConvertInt, checkCidFormat
}