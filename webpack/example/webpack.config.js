let path =require('path');
let StartPlugin = require('./plugins/start_plugin');
let endPlugin = require('./plugins/end_plugin');

module.exports = {
	mode: 'development',
	devtool: false,
	entry: {
		main: './src/index.js',
		// entry2: './src/entry2.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					path.resolve(__dirname, 'loaders', 'loader1'),
					path.resolve(__dirname, 'loaders', 'loader2')
				]
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json']
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new StartPlugin(),
		new endPlugin()
	]
}
