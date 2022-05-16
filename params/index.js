const convert = require('koa-convert')
const path = require('path')
const autoCollect = require('../utils/autoCollect')

// 主要当koa的参数确定 config.js为参数配置
const callback = (fileList) => {
  let obj = {}
  fileList.forEach(file => {
    const item = require(path.join(__dirname, file));
    obj[file] = item;
  })
  return obj
}
// paramConfig格式为 a.b.c.d.f 表示为/a/b/c的路径层为传递的参数d 验证格式参数为f
// exp: user.create.userAccount.isRequired 表示为根路径下 /user/create 的userAccount参数是否必须传入
// 如果最后一层为null，则不需要传递任何参数
const paramConfig = autoCollect(__dirname, ['index.js', 'reg.js'], callback)

const typeHash = {
  string: (str) => String(str),
  number: (num) => Number(num)
}

const check = (pathList, body) => {
  let expectedBody
  let tParamConfig = paramConfig
  for (let item of pathList) {
    if(expectedBody === null) break
    if (tParamConfig[item] === undefined) {
      console.error(`
        Path params undefined.
      `)
      return { canNext: false, msg: 'path failed' }
    }
    expectedBody = tParamConfig[item]
    tParamConfig = tParamConfig[item]
  }

  if(expectedBody === null) return { canNext: true, msg: 'no param' }

  for (let item in expectedBody) {
    const expectedBodyItem = expectedBody[item]
    let bodyItem = body[item]
    if (expectedBodyItem.isRequired && bodyItem === undefined) {
      console.error(`
        Param ${item} was deficiency.\n
        This is complete params ${expectedBody}
      `)
      return { canNext: false, msg: 'param failed' }
    }

    // 在验证前做类型转换，默认为string
    if(expectedBodyItem.type !== undefined) {
      body[item] = typeHash[expectedBodyItem.type](body[item])
      bodyItem = typeHash[expectedBodyItem.type](bodyItem)
    }

    if (expectedBodyItem.regValid) {
      const reg = expectedBodyItem.regValid

      if(reg instanceof RegExp) {
        if (!reg.test(bodyItem)) {
          return { canNext: false, msg: expectedBodyItem.validFailedMsg }
        }
      }
      else {
        if(!reg(bodyItem)) {
          return { canNext: false, msg: expectedBodyItem.validFailedMsg }
        }
      }
    }
  }
  return {
    canNext: true,
    msg: 'success'
  }
}
module.exports = async (ctx, next) => {
  const { request, response, path } = ctx
  const pathList = path.split('/')
  // 弹走''字符串
  pathList.shift()
  let { canNext, msg } = check(pathList, request.body)
  if (canNext === true) await next();
  else response.body = {
    data: {},
    msg,
    state: 0
  }
}