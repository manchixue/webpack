let path =require('path');
let StartPlugin = require('./plugins/start_plugin');
let endPlugin = require('./plugins/end_plugin');

module.exports = {
	mode: 'development',
	entry: {
		main: './src/index.js'
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
