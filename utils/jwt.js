const jwt = require('jsonwebtoken')
const key = 'ppap'
const expiresIn = '30d'

const sign = async (obj) => {
  return new Promise((res, rej) => {
    jwt.sign(obj, key, { expiresIn }, (err, token) => {
      if(err) throw err
      res(token)
    })
  })
}

const verify = async (token) => {
  return new Promise((res, rej) => {
    jwt.verify(token, key, (err, decode) => {
      if(err) res(false)
      else res(decode)
    })
  })
}

module.exports = {
  sign, verify
}