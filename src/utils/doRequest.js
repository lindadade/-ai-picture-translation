// doRequest ：执行POST请求，并取回响应结果
// 参数说明
//   - $url   ：接口请求地址
//   - $params：完整接口请求参数（特别注意：不同的接口，参数对一般不一样，请以具体接口要求为准）
// 返回数据
//   - 返回false表示失败，否则表示API成功返回的HTTP BODY部分
import axios from 'axios'
import {Message} from 'element-ui'

// 创建一个 axios 实例
const service = axios.create({
	// withCredentials: true, // 跨域请求时发送Cookie
	timeout: 5e3 // request timeout
})

// request interceptor
service.interceptors.request.use(
	config => {
		config.baseURL = '/api/'
		config.headers = {'Content-Type': 'application/x-www-form-urlencoded'}

		return config
	},
	error => {
		// do something with request error
		console.log(error) // for debug
		return Promise.reject(error)
	}
)

// response interceptor
service.interceptors.response.use(
	response => {
		const ERROR = '网络请求错误'
		if (response.status !== 200) {
			console.log('11')
			Message({
				message: ERROR,
				type: 'error',
				duration: 5e3
			})
			return Promise.reject(ERROR)
		}
		const res = response.data
		return JSON.stringify(res)
	},
	error => {
		const TIMEOUT_ERROR = '网络请求超时，请刷新重试'
		console.log('err' + error) // for debug
		Message({
			message: error.message.includes('timeout') ? TIMEOUT_ERROR : error.message,
			type: 'error',
			duration: 5e3
		})
		return Promise.reject(error)
	}
)
// 发送请求
export const doPost = (url, params, config = {}) => service.post(url, params, config)
export const doGet = (url, config = {}) => service.get(url, {...config})
