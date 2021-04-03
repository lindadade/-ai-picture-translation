module.exports = {
	devServer: {
		proxy: {
			'/api': {
				target: 'https://aip.baidubce.com',
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			}
		}
	}
}
