<template>
	<div class="picT">
		<el-row :gutter="20">
			<el-col :span="16">
				<el-card shadow="hover">
					<el-upload
						class="upload-demo"
						ref="upload"
						:action="''"
						:on-change="onchange"
						drag
						multiple
						:auto-upload="false"
					>
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						<div class="el-upload__tip" slot="tip">
							<el-button
								style="margin-left: 10px;"
								size="small"
								type="success"
								@click="submitUpload"
							>上传翻译
							</el-button>
						</div>
					</el-upload>
				</el-card>
			</el-col>
			<el-col :span="8">
				<div class="grid-content bg-purple"></div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { getReqSign } from '../utils/getReqSign'
import { doPost } from '../utils/doRequest'

export default {
	name: 'picTranslation',
	components: {},
	data() {
		return {
			data: undefined,
			url: 'fcgi-bin/nlp/nlp_wordsyn',
			path: '../assets/hls.png',
			params: {
				app_id: '2129730782',
				// image: undefined,
				// session_id: '1509333186',
				text: '今天的天气怎么样',
				// scene: 'doc',
				// source: 'en',
				// target: 'zh',
				time_stamp: '',
				nonce_str: '',
				sign: ''
			},
			appKey: '4MKnb9VtF04Ig2qM'
		}
	},
	methods: {
		//这个file参数 也就是文件信息
		getBase64(file) {
			return new Promise((resolve, reject) => {
				let reader = new FileReader();
				let fileResult = "";
				reader.readAsDataURL(file);
				//开始转
				reader.onload = function() {
					fileResult = reader.result;
				}
				//转 失败
				reader.onerror = function(error) {
					reject(error);
				}
				//转 结束  咱就 resolve 出去
				reader.onloadend = function() {
					resolve(fileResult);
				}
			})
		},
		serialize(obj) {
			return Object.keys(obj).reduce(function (a, k) {
				a.push(k + '=' + encodeURIComponent(obj[k]));
				return a
			}, []).join('&')
		},
		async onchange(file, fileList) {
			// const img = await this.getBase64(file.raw)
			// console.log(img)
			const date = new Date().getTime().toString()
			const rand = Math.random().toString()
			this.params = {
				...this.params,
				// image: img,
				time_stamp: '1583597115',
				nonce_str: rand,
			}
			// this.params = this.serialize(this.params)
			this.params.sign = await getReqSign(this.params, this.appKey)
			// 转成键值对
			this.data = this.serialize(this.params)
			console.log(this.data)
		},
		async submitUpload() {
			const response = await doPost(this.url, this.data)
			console.log(response)
			this.$refs.upload.submit()
		}
	}
}
</script>

<style scoped>
	.bg-purple {
		background: #d3dce6;
	}

	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}
</style>
