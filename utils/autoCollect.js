const fs = require('fs')
const path = require('path')
/**
 * @description 自动获取该目录文件夹下的js文件名称，方便导包或者做相应处理
 */
const autoCollect = (dirPath, excludePath, callback) => {
  excludePath = new Set(excludePath)
  const fileList = fs
  .readdirSync(dirPath)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js') && !excludePath.has(file);
  })
  .map(file => {
    // 做文件名去".js"后缀处理还有转小写
    return file.slice(0, file.length - 3).toLowerCase()
  })
  return callback(fileList)
}

module.exports = autoCollect