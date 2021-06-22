const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
	mode: "none",
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "main.js"
	},
	devtool: 'eval-source-map',
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin()
		]
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: {
					loader: 'babel-loader'
				},
				exclude: '/node_modules/'
			},
			{
				test: /\.txt$/,
				use: 'raw-loader'
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
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
					MiniCssExtractPlugin.loader,
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
					MiniCssExtractPlugin.loader,
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
			template: './src/index.html',
			minify: {
				collapseWhitespace: true,
				removeComments: true
			}
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[hash:6].css'
		}),
		new OptimizeCssAssetsWebpackPlugin()
	],
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		compress: true,
		port: 8081,
		open: true
	}
}
