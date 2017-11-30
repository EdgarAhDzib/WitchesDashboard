module.exports = {
	entry: "./app/app.js",
	output: {
		filename: "public/assets/js/bundle.js"
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				include: /app/,
				loader: "babel-loader",
				query: {
					presets: ["react", "es2015", "stage-0"],
					plugins: ["transform-decorators-legacy"]
				}
			}	
		]
	},
	devtool: "eval-source-map"
};
