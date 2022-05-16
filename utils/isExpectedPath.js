/**
 * @description url路径字符串和所期待的树形url路径做判断，是否可以在树形url得到一条path路径
 * @param path STRING 要判断的路径path
 * @param expectPathObj OBJECT 所期待的树形路径
 * @reference  
 */
module.exports = (path, expectPathObj) => {
  let tExpectPathObj = expectPathObj
  const pathList = path.split('/')
  // 弹走第一个空字符串
  pathList.shift()
  for(let i of pathList) {
    if(tExpectPathObj[i] === undefined) return false
    tExpectPathObj = tExpectPathObj[i]
  }
  return true
}