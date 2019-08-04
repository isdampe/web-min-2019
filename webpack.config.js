const path = require('path');

module.exports = {
	entry: ['./assets/ts/app.ts', './assets/scss/app.scss'],
	watchOptions: {
		aggregateTimeout: 1000,
		poll: 1000,
		ignored: ["node_modules"]
	},
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '../css/app.css',
						}
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'sass-loader',
						options: {
							outputStyle: "compressed"
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'assets/js')
	}
};
