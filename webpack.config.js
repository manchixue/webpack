const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	mode: "none",
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "main.js"
	},
	module: {
		rules: [
			{
				test: /\.txt$/,
				use: 'raw-loader'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1
						}
					},
					'postcss-loader'
				]
			},
			{
				test: /\.less$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1
						}
					},
					'postcss-loader',
					'less-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1
						}
					},
					'postcss-loader',
					'sass-loader'
				]
			}
		]
	},
	plugins: [
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
