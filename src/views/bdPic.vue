<template>
	<div class="content">
		<el-row :gutter="20">
			<el-col :span="10" class="card-panel-col">
				<el-card class="box-card" shadow="hover">
					<div slot="header" class="clearfix headText">
						<span>上传图片</span>
					</div>
					<div>
						<el-upload
							class="upload-demo"
							ref="upload"
							:on-change="hanleChange"
							:http-request="submitUpload"
							:action="''"
							:file-list="fileList"
							list-type="picture"
							drag
							multiple
							:auto-upload="false"
						>
							<div class="img">
								<i class="el-icon-upload"></i>
								<div class="el-upload__text img">将文件拖到此处，或<em>点击上传</em></div>
							</div>
							<div class="el-upload__tip" slot="tip">
								<el-button
									style="margin-left: 10px;"
									size="small"
									type="primary"
									@click="submitUpload"
								>上传翻译
								</el-button>
							</div>
						</el-upload>
					</div>
				</el-card>
			</el-col>

			<el-col :span="14" class="card-panel-col">
				<el-card class="box-card2" shadow="hover">
					<div slot="header" class="clearfix headText">
						<span>识别内容</span>
					</div>
					<el-table
						:data="text"
						fit
						highlight-current-row
						style="width: 100%;"
					>
						<el-table-column label="🌟🌟🌟" prop="words" align="center" min-width="120px"/>
					</el-table>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import qs from 'qs'
import {doGet, doPost} from "../utils/doRequest";


export default {
	name: "bdPic",
	data() {
		return {
			image: '',
			url: "rest/2.0/ocr/v1/webimage",
			clientId: '12EN3roG78My8EVZ1WuxgelR',
			clientSecret: 'naNoSmjAz7YZDhr0OYxfolG4b2SYhotp',
			accessToken: undefined,
			expiresIn: undefined,
			text: null,
			fileList: undefined
		}
	},
	methods: {
		getBase64(file) {
			return new Promise(function (resolve, reject) {
				let reader = new FileReader();
				let imgResult = "";
				reader.readAsDataURL(file);
				reader.onload = function () {
					imgResult = reader.result;
				};
				reader.onerror = function (error) {
					reject(error);
				};
				reader.onloadend = function () {
					resolve(imgResult);
				};
			});
		},
		async hanleChange(file,fileList) {
			const param = qs.stringify({
				grant_type: 'client_credentials',
				client_id: this.clientId,
				client_secret: this.clientSecret
			})
			let token = await doGet(`/oauth/2.0/token?${param}`)
			token = JSON.parse(token)
			this.accessToken = token.access_token
			this.expiresIn = token.expires_in
			this.fileList = fileList
			this.image = await this.getBase64(file.raw)
			this.image = this.image.replace('data:image/jpeg;base64,', '')
		},
		async submitUpload() {
			const params = qs.stringify({image: this.image})
			this.url = this.url + "?access_token=" + this.accessToken
			let data = await doPost(this.url, params)
			data = eval("("+data+")");
			this.text = data.words_result
			this.$refs.upload.clearFiles()
		}
	}
}
</script>

<style scoped>
	.content {
		position: absolute;
		margin: 0px;
		padding: 10%;
		width: 100%;
		height: 100%;
		background-color: #f1f3f4;
	}

	.headText {
		line-height: 16px;
		color: rgba(0, 0, 0, 0.45);
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 12px;
	}
	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}

	.box-card {
		width: 480px;
		height: 100%;
	}

	.box-card2 {
		top: -100px;
		width: 600px;
		height: 100%;
	}

</style>
