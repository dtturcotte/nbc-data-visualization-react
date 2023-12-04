// 'use strict'

const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	entry: './src/index.tsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json'],
	},
	module: {
		rules: [
			{
				// Process TypeScript files
				test: /\.(ts|tsx)$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
			// If importing JSON or CSV files directly into D3 code:
			{
				test: /\.(csv|tsv)$/,
				use: ['csv-loader'],
			},
			{
				test: /\.json$/,
				use: ['json-loader'],
			},
			{
				test: /\.(scss)$/,
				use: [
					{
						// This adds CSS to the DOM by adding a <style> tag
						loader: 'style-loader',
					},
					{
						// This interprets / resolves @import and url(), etc
						loader: 'css-loader',
					},
					{
						// This is a loader for webpack to process .css with PostCSS
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [autoprefixer],
							},
						},
					},
					{
						// This loads a .scss file and compiles it to .css
						loader: 'sass-loader',
					},
				],
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: './static', to: '.' }],
		}),
	],
	devServer: {
		static: path.join(__dirname, 'dist'),
		compress: true,
		port: 3001,
		hot: true,
		open: false,
		watchFiles: {
			paths: ['src/**/*.tsx', 'src/**/*.ts', 'src/**/*.js'],
			options: {
				ignored: /node_modules/,
			},
		},
	},
}
