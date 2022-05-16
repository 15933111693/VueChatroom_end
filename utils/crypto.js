const crypto = require("crypto");
const CryptoJS = require("crypto-js")

// const key = crypto.randomBytes(32); // 密钥
const key = "afadsdfd"
const k = key

// AES 加密
const aesEncrypt = (data, key = k) => {
  return CryptoJS.AES.encrypt(data, key).toString()
};

// AES 解密
const aesDecrypt = (data, key = k) => {
  return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8)
};

module.exports = {
  aesEncrypt, aesDecrypt
}