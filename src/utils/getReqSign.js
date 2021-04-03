// getReqSign ：根据 接口请求参数 和 应用密钥 计算 请求签名
// 参数说明
//   - $params：接口请求参数（特别注意：不同的接口，参数对一般不一样，请以具体接口要求为准）
//   - $appkey：应用密钥
// 返回数据
//   - 签名结果
import md5 from 'md5'

function JsonSort (jsonData) {
  try {
    const tempJsonObj = {}
    const sdic = Object.keys(jsonData).sort()
    sdic.map((item, index) => {
      tempJsonObj[item] = jsonData[sdic[index]]
    })
    return tempJsonObj
  } catch (e) {
    return jsonData
  }
}

export function getReqSign (params, appKey) {
  // 1. 字典升序排序
  JsonSort(params)
  // 2. 拼按URL键值对
  let str = ''
  Object.keys(params).forEach((key, i) => {
    if (params[key] !== '') {
      str += key + '=' + encodeURIComponent(params[key]) + '&'
    }
  })
  // 3. 拼接app_key
  let key = `${str}app_key=${appKey}`
  // 4.MD5运算
  let appKeys = md5(key)
  // 5.转换大写
	console.log(appKeys)
  let sign = appKeys.toUpperCase()
  return sign
}
