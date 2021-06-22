const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "main.js"
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: {
					loader: 'babel-loader'
				},
				exclude: '/node_modules/'
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["**/*"] }),
		new HtmlWebpackPlugin({
			template: './src/index.html'
		})
	],
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		compress: true,
		port: 8081,
		open: true
	}
}
