const autoCollect = require('../utils/autoCollect')

module.exports = (db) => {
  const callback = (fileList) => {
    const obj = {}
    for(let i of fileList) {
      const Serve = require(`./${i}`)
      obj[i] = new Serve(db)
    }
    return obj
  }

  const allServiceInstance = autoCollect(__dirname, ['index.js', 'DB.js'], callback)
  return allServiceInstance
}